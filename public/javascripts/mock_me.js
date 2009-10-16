var MockMe = {
    Version: '0.9beta2',

    checkIsMockedFunction: function(f) {
        if (!Object.isFunction(f)) {
            throw new MockMe.Exception('Not a function');
        }
        if (!f.stub) {
            throw new MockMe.Exception('Not a mock');
        }
    }
}

Object.extend(Array.prototype, {
    remove: function(element) {
        var index = -1;
        for (var i = 0, length = this.length; i < length; i++) {
            if(this[i] === element) {
                index = i;
                break;
            }
        }
        if (index != -1) this.splice(index, 1);
    },

    addFirst: function(element) {
        this.splice(0, 0, element);
    }
});

var IdentityHash = Class.create({
    initialize: function() {
        this._entries = [];
    },

    size: function() {
        return this._entries.length;
    },

    set: function(key, value) {
        var entry = this._entries.find(function(each) {
            return this._matchKeyForSet(each.key, key);
        }.bind(this));
        if (entry === undefined) {
            this._entries.addFirst({
                key: key,
                value: value
            });
        } else {
            entry.value = value;
        }
    },

    get: function(key) {
        var entry = this._entries.find(function(each) {
            return this._matchKey(each.key, key);
        }.bind(this));
        if (entry !== undefined) return entry.value;
        return undefined;
    },

    each: function(closure) {
        this._entries.each(closure);
    },

    _matchKeyForSet: function(key, matchingKey) {
        return this._matchKey(key, matchingKey);
    },

    _matchKey: function(key, matchingKey) {
        return key === matchingKey;
    }

});


ArgumentsMatchingHash = Class.create(IdentityHash, {
    initialize: function(matchersInStoredKey) {
        this._matchersInStoredKey = matchersInStoredKey || false;
        IdentityHash.prototype.initialize.call(this);
    },

    eachMatch: function(args, closure) {
        this.each(function(pair) {
            if (this._matchKey(pair.key, args)) {
                closure(pair);
            }
        }.bind(this));
    },

    _matchKeyForSet: function(key, matchingKey) {
        return this._matchKey(key, matchingKey, true);
    },

    _matchKey: function(keyArgs, args, ignoreMatchers) {
        if (this._matchersInStoredKey) {
            return this._matchArrays(args, keyArgs, ignoreMatchers);
        } else {
            return this._matchArrays(keyArgs, args, ignoreMatchers);
        }
    },

    _matchArrays: function(array, arrayWithMatchers, ignoreMatchers) {
        if (! arrayWithMatchers instanceof Array) return false;
        if (array.length != arrayWithMatchers.length) return false;
        for (var index = 0; index < array.length; ++index) {
            var val = array[index];
            var valOrMatcher = arrayWithMatchers[index];
            if (! this._matchValues(val, valOrMatcher, ignoreMatchers)) return false;
        }
        return true;
    },

    _matchValues: function(val, valOrMatcher, ignoreMatchers) {
        ignoreMatchers == ignoreMatchers || false;
        if (val === valOrMatcher) return true;
        if (valOrMatcher && valOrMatcher.match && (valOrMatcher.match instanceof Function)) {
            if (ignoreMatchers) return false;
            return valOrMatcher.match(val);
        }
        if ((val instanceof Array)) {
            return this._matchArrays(val, valOrMatcher, ignoreMatchers);
        }
        if ((val instanceof Object) && (valOrMatcher instanceof Object)) {
            return this._matchObjects(val, valOrMatcher, ignoreMatchers);
        }
        return false;
    },

    _matchObjects: function(obj, objOrMatcher, ignoreMatchers) {
        if (obj.constructor !== objOrMatcher.constructor) return false;
        for (prop in obj) {
            if (!this._matchValues(obj[prop], objOrMatcher[prop], ignoreMatchers)) return false;
        }
        for (prop in objOrMatcher) {
            if (!this._matchValues(obj[prop], objOrMatcher[prop], ignoreMatchers)) return false;
        }
        return true;
    }
});

var Interface = {
    create: function() {
        var methods = $A(arguments);
        function klass() {}
        methods.each(function(each) {
            if (!Object.isString(each)) return;
            klass.prototype[each] = function() {};
        });
        return klass;
    }
}

var Mocker = Class.create({

    initialize: function() {
        this._reset();
    },

    _reset: function() {
        this._mockedFunctions = [];
        this._mockedObjects = [];
        this._mockedClasses = [];
        this._stubbedCalls = new IdentityHash();
        this._recordedCalls = new IdentityHash();
    },

    useIn: function(closure) {
        try {
            closure(this);
        } finally {
            this.unmockAll();
            this._reset();
        }
    },

    mockInterface: function(clazz) {
        var object = {};
        this._createEmptyMethodsFromPrototype(clazz.prototype, object);
        return this.mockObject(object);
    },

    _createEmptyMethodsFromPrototype: function(proto, mock) {
        for(propName in proto) {
            if (propName == 'prototype' || propName == 'constructor') {
                continue;
            }
            var propValue = proto[propName];
            if (this._shouldBeMocked(propValue)) {
                mock[propName] = function() {};
            }
        }
    },

    mock: function() {
        var thingsToMock = $A(arguments);
        if (thingsToMock.size() == 0) return this.mockFunction();
        var mocks = thingsToMock.collect(function(each) {
            return this._mock(each);
        }.bind(this));
        return mocks.reduce();
    },

    _mock: function(something) {
        if (typeof(something) == 'object') return this.mockObject(something);
        if (typeof(something) == 'function') return this.mockClass(something);
        throw new MockMe.Exception('Cannot mock', something.toString());
    },

    mockClass: function(clazz) {
        if (clazz.prototype) {
            clazz.originalPrototype = clazz.prototype;
            clazz.prototype = new Object();
            Object.extend(clazz.prototype, clazz.originalPrototype);
            this._mockAllMethods(clazz.prototype);
        }
        this._mockAllMethods(clazz);
        clazz.unmock = function() {
            this._unmockAllMethods(clazz.prototype);
            clazz.prototype = clazz.originalPrototype;
            this._unmockAllMethods(clazz);
            this._mockedClasses.remove(clazz);
            delete clazz.unmock;
            delete clazz.originalPrototype;
        }.bind(this);
        this._mockedClasses.push(clazz);
        var mockedClass = this.mockFunction();
        mockedClass.prototype = clazz.prototype;
        mockedClass.original = clazz;
        mockedClass.unmockOrg = mockedClass.unmock;
        mockedClass.unmock = function() {
            if (clazz.unmock) { // Could have been called earlier
                clazz.unmock();
            };
            mockedClass.unmockOrg();
        };
        return mockedClass;
    },

    mockObject: function(anObject) {
        this._mockAllMethods(anObject);
        anObject.unmock = function() {
            this._unmockAllMethods(anObject);
            this._mockedObjects.remove(anObject);
            delete anObject.unmock;
        }.bind(this);
        this._mockedObjects.push(anObject);
        return anObject;
    },

    _mockAllMethods: function(anObject) {
        for(propName in anObject) {
            if (propName == 'prototype' || propName == 'constructor') {
                continue;
            }
            var propValue = anObject[propName];
            if (this._shouldBeMocked(propValue)) {
                this.within(anObject).mock(propValue);
            }
        }
    },

    _shouldBeMocked: function(f) {
        return Object.isFunction(f) && !this._shouldBeIgnored(f);
    },

    _shouldBeIgnored: function(f) {
        if (Object.values(Function.prototype).include(f)) return true;
        return false;
    },

    _unmockAllMethods: function(anObject) {
        for(propName in anObject) {
            if (propName == 'prototype' || propName == 'constructor') {
                continue;
            }
            var propValue = anObject[propName];
            if (Object.isFunction(propValue) && propValue.unmock) {
                propValue.unmock();
            }
        }
    },

    within: function(container) {
        var mockFunction = function(functionOrName) {
            var f = functionOrName;
            if (Object.isString(functionOrName)) {
                f = container[functionOrName];
            }
            var mock= this.mockFunction(container, f);
            container[mock.propName] = mock;
            return mock;
        }.bind(this);
        return {
            mock: function() {
                var args = $A(arguments);
                if (args.size() > 1) {
                    return args.collect(function (each) {
                        return mockFunction(each);
                    });
                }
                return mockFunction(args[0]);
            }.bind(this)
        }
    },

    _isFunctionFromPrototype: function(f, container, propName) {
        if (container.constructor != Object && container.constructor.prototype !== container) {
            return container.constructor.prototype[propName] === f;
        }
        return false;
    },

    mockFunction: function(container, original) {
        var that = this;
        var f = function() {
            var args = $A(arguments);
            that._recordCall(f, args);
            var action = that._getStubbedReturnAction(f, args);
            if (action)
                return action.apply(this, args);
        };
        if ($A(arguments).size() == 1 && Object.isString(container)) {
            f.propName = container;
            container = null;
        } else {
            f.propName = 'anonymous-function';
        }
        f.container = null || container;
        f.original = original || null;
        if (container && original) {
            if (typeof(original) != 'function') throw new MockMe.Exception('Not a function');
            var name = this._findName(container, original);
            f.propName = name;
            f.originalFromPrototype = this._isFunctionFromPrototype(f.original, container, f.propName);
        }
        f.mocker = this;
        this._mockedFunctions.push(f);
        Object.extend(f, MockedFunction);
        return f;
    },

    unmockAll: function() {
        this._mockedClasses.clone().each(function(mock) {
            mock.unmock();
        });
        this._mockedObjects.clone().each(function(mock) {
            mock.unmock();
        });
        this._mockedFunctions.clone().each(function(mock) {
            mock.unmock();
        });
    },

    _findName: function(obj, value) {
        for(name in obj) {
            if (obj[name] === value) return name;
        }
        throw new MockMe.Exception('Function not in container');
    },

    _stubCall: function(f, params, returnValue) {
        var values = this._stubbedCalls.get(f);
        if (!values) {
            values = new ArgumentsMatchingHash(true);
        }
        values.set(params, returnValue);
        this._stubbedCalls.set(f, values);
    },

    _getStubbedReturnAction: function(f, params) {
        var values = this._stubbedCalls.get(f);
        if (!values) return undefined;
        return values.get(params);
    },

    _recordCall: function(f, params, returnValue) {
        var records = this._recordedCalls.get(f);
        if (!records) {
            records = new ArgumentsMatchingHash(false);
        }
        var count = records.get(params) || 0;
        records.set(params, ++count);
        this._recordedCalls.set(f, records);
    },

    _countRecordedCalls: function(f, params) {
        var records = this._recordedCalls.get(f);
        if (!records) return 0;
        var count = 0;
        records.eachMatch(params, function(pair) {
            count += pair.value;
        });
        return count;
    }
});

var MockedFunction = {
    _params: [],

    verify: function(checkCount) {
        checkCount = checkCount || atLeastOnce();
        var args = $A(arguments).slice(1, arguments.length);
        var count = this.mocker._countRecordedCalls(this, args);
        if (!checkCount(count)) {
            throw new MockMe.Exception('Verify call error', this.propName + '(' + $A(args).join(', ') + ')' +
                ' should be called ' + checkCount.toString() +
                ' times but was called ' + count + ' times');
        }
    },

    stub: function() {
        this._params = $A(arguments);
        return this;
    },

    _stubCurrentCall: function(action) {
        this.mocker._stubCall(this, this._params, action);
    },

    thenReturn: function(value) {
        this._stubCurrentCall(function() {
            return value
            });
    },

    thenReturnNothing: function() {
        this.thenReturn(undefined);
    },

    thenThrow: function(ex) {
        this._stubCurrentCall(function() {
            throw ex
            });
    },

    thenDo: function(closure) {
        this._stubCurrentCall(closure);
    },

    unmock: function() {
        if (!this.container || !this.original) return;
        if (this.originalFromPrototype) {
            delete this.container[this.propName];
        } else {
            this.container[this.propName] = this.original;
        }
        this.mocker._mockedFunctions.remove(this);
    }
}

MockMe.Exception = Class.create({
    initialize: function(name, message) {
        this.name = name;
        this.message = message || '';
    },

    toString: function() {
        return this.name;
    }
});

// Global Functions

var when = function(f) {
    MockMe.checkIsMockedFunction(f);
    return f.stub.bind(f);
}

var verify = function() {
    var times = once();
    var f = arguments[0];
    if (arguments.length > 1) {
        times = arguments[0];
        f = arguments[1];
    }
    MockMe.checkIsMockedFunction(f);
    return f.verify.bind(f, times);
}

var useMockerFor = function(closure) {
    var mocker = new Mocker();
    mocker.useIn(closure);
}

var mock = function() {
    var toMock = $A(arguments);
    var mocker = new Mocker();
    mocker.mock.apply(mocker, toMock);
    return {
        andDo: function(closure) {
            mocker.useIn(closure);
        }
    }
}

//Call count verifiers

var times = function(times) {
    var f = function(count) {
        return count == times;
    };
    f.toString = function() {
        return times
        };
    return f;
}

var never = times.curry(0);

var once = times.curry(1);

var atLeast = function(times) {
    var f = function(count) {
        return count >= times;
    };
    f.toString = function() {
        return 'at least ' + times
        };
    return f;
}

var atLeastOnce = atLeast.curry(1);

//Matchers

var any = function() {
    return {
        match: function() {
            return true
            },
        toString: function() {
            return 'any()'
            }
    };
};

var isOfType = function(type) {
    return {
        match: function(obj) {
            return (typeof(obj) == type)
            },
        toString: function() {
            return 'isOfType(' + type + ')'
            }
    };
};

var anyString = isOfType.curry('string');

var anyNumber = isOfType.curry('number');

var isInstanceOf = function(constructor) {
    if(typeof(constructor) != 'function')
        throw new MockMe.Exception("Can only take constructors", constructor + ' is not a constructor');
    return {
        match: function(obj) {
            return (obj instanceof constructor)
            },
        toString: function() {
            return 'isInstanceOf(aConstructor)'
            }
    };
};

var isSame = function(expectedObj) {
    return {
        match: function(obj) {
            return (expectedObj === obj)
            },
        toString: function() {
            return 'isSame(' + expectedObj + ')'
            }
    };
};

var contains = function(containedObj) {
    var containsForArrays = function(array) {
        if (!Object.isArray(containedObj)) {
            return array.include(containedObj);
        }
        return !containedObj.any(function(each) {
            return !array.include(each);
        });
    }
    var containsForObjects = function(obj) {
        for(prop in containedObj) {
            if (obj[prop] != containedObj[prop]) return false;
        }
        return true;
    }
    return {
        match: function(obj) {
            if (Object.isArray(obj)) {
                return containsForArrays(obj);
            }
            if (typeof(obj) == 'object') {
                return containsForObjects(obj);
            }
            return false;
        }
        };
};



