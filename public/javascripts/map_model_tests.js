test("initializeModel").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.init();

    this.isEqual(3, model.addedMarkers.length);
}

test("setAllMarkersOnMap").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.filter('all');

    this.isEqual(3, model.addedMarkers.length);
}

test("removeAMarkersOnMap").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.filter('a');
    model.filter('b');

    this.isEqual(1, model.addedMarkers.length);
}

test("setAMarkersOnMap").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.filter('a');

    this.isEqual(2, model.addedMarkers.length, "after filter");
}

test("setBMarkersOnMap").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.filter('b');

    this.isEqual(1, model.addedMarkers.length);
}

test("addMarker").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.addMarker(data[0]);

    this.isEqual(1, model.addedMarkers.length);
}

test("addMarkerRemoveDifferentShouldNotHappen").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.addMarker(data[0]);
    model.removeMarker(data[1]);

    this.isEqual(1, model.addedMarkers.length);
}

test("addSameMarkerTwice").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.addMarker(data[0]);
    model.addMarker(data[0]);

    this.isEqual(1, model.addedMarkers.length);
}

test("addDifferentMarkers").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.addMarker(data[0]);
    model.addMarker(data[1]);

    this.isEqual(2, model.addedMarkers.length);
}

test("addAllMarkersRemoveOne").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.addMarker(data[0]);
    model.addMarker(data[1]);
    model.addMarker(data[2]);
    model.removeMarker(data[1]);

    this.isEqual(2, model.addedMarkers.length);
}

test("selectMarker").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.filter('all');

    model.selectMarker(2);

    this.isEqual(data[1], model.selectedMarker);
}

test("existsNot").should = function () {
    var data = newMarkerData(buildTestTowers());
    var model = newMarkerModel(data);

    model.addMarker(data[0]);
    this.isTrue(model.existsNot(data[1]));
    this.isFalse(model.existsNot(data[0]));
}

test("isTypeA").should = function () {
    var data = newMarkerData(buildTestTowers());

    this.isTrue(isType('a', data[0]), "zero");
    this.isTrue(isType('a', data[1]), "one");
    this.isFalse(isType('a', data[2]), "two");
}

test("isTypeB").should = function () {
    var data = newMarkerData(buildTestTowers());

    this.isFalse(isType('b', data[0]), "zero");
    this.isFalse(isType('b', data[1]), "one");
    this.isTrue(isType('b', data[2]), "two");
}

test("isTypeA").should = function () {
    var data = newMarkerData(buildTestTowers());

    this.isTrue(isType('all', data[0]), "zero");
    this.isTrue(isType('all', data[1]), "one");
    this.isTrue(isType('all', data[2]), "two");
}

test("isTypeA").should = function () {
    var data = newMarkerData(buildTestTowers());

    this.isFalse(isType('junk', data[0]), "zero");
    this.isFalse(isType('junk', data[1]), "one");
    this.isFalse(isType('junk', data[2]), "two");
}

var isType = function(tower_type, tower) {
    return tower_type == tower.tower_type || tower_type == 'all';
}

function newMarkerModel(data) {
    var Model = new Object();
    
    Model.addedMarkers = new Array();    
    Model.data = data;
    Model.selectedMarker = new Object();

    Model.fireAddMarker = function() {}
    Model.fireRemoveMarker = function() {}
    Model.fireOpenMarkerWindow = function() {}

    Model.init = function() {
        //TODO google markers to addedMarkers
        this.addGoogleMarkers();
    }

    Model.addGoogleMarkers = function() {
        this.filter('all');
    }

    Model.selectMarker = function(id) {
        var isId = function(x) {
            return x.id == id;
        }
        this.selectedMarker = this.addedMarkers.filter(isId)[0];
        this.fireOpenMarkerWindow(this.selectedMarker);
    }

    Model.filter = function(tower_type) {
        for(i=0; i < this.data.length; i++) {
            var current = this.data[i];

            if (isType(tower_type, current)) {
                this.addMarker(current);
            }
            else {
                this.removeMarker(current);
            }
        }
    }

    Model.addMarker = function(marker) {
        if(this.existsNot(marker)) {
            this.addedMarkers.push(marker);
            this.fireAddMarker(marker);
        }
    }

    Model.removeMarker = function(marker) {
        var idx = this.addedMarkers.indexOf(marker);
        if(idx != -1) {
            this.addedMarkers.splice(idx, 1);
            this.fireRemoveMarker(marker);
        }
    }

    Model.existsNot = function(marker) {
        return this.addedMarkers.indexOf(marker) == -1;
    }

    return Model;
}

function newMarkerData(towers) {
    var col = [];

    for( i = 0; i < towers.length; i++) {
        var tower = towers[i].tower;
        col.push(newMarker(tower));
    }
    return col;
}

function newMarker(tower) {
    var marker = new Object();
    
    marker['id'] = tower.id;
    marker['latitude'] = tower.latitude;
    marker['longitude'] = tower.longitude;
    marker['address'] = tower.address;
    marker['city'] = tower.city;
    marker['state'] = tower.state;
    marker['height'] = tower.city;
    marker['tower_type'] = tower.structure_type;

    return marker;
}

function buildTestTowers() {
    var one = { 'id': 1, 'structure_type': 'a' };
    var two = { 'id': 2, 'structure_type': 'a' };
    var three = { 'id': 3, 'structure_type': 'b' };
    return [ {'tower': one}, {'tower': two}, {'tower': three}];
}

