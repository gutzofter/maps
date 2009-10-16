
//newTest("should_encodeMarkerData").Execute = function () {
//    var emptyElements = { 'found': "", 'left': "", 'lat': "", 'lng': ""};
//
//    this.isEqual("?m[found]=&m[left]=&m[lng]=&m[lat]=", encodeMarkerData(emptyElements));
//}
//

function parseJSON(jsonText) {
    var result;
    try {
        result = eval( "(" + jsonText + ")" );
    }
    catch(e){
        result = "Error!"
    }
    return result;
}

newTest("should_parseBlankJSON").Execute = function () {
    var badJSON = "";

    this.isEqual("Error!", parseJSON(badJSON));
}

newTest("should_parseOneMarkerJSON").Execute = function () {
    var goodJSON = "{\"success\":true,\"content\":[{\"marker\":{\"found\":\"found\",\"id\":2053932785,\"lat\":1.0,\"left\":\"left\",\"lng\":-1.0}}]}";

    res = parseJSON(goodJSON);

    this.isEqual(true, res.success);
    markers = res.content;
    this.isEqual(1, markers.size());
    try {
        marker = markers[0].marker;
        this.isEqual("found", marker['found']);

    }
    catch(e) {
        this.fail(failMessage(e));
    }

}

newTest("should_generateFailMessage").Execute = function () {
    var badJSON = "";

    this.isEqual("Error!", parseJSON(badJSON));
}

function windowHeight() {
    // Standard browsers (Mozilla, Safari, etc.)
    if (self.innerHeight)
        return self.innerHeight;
    // IE 6
    if (document.documentElement && document.documentElement.clientHeight)
        return y = document.documentElement.clientHeight;
    // IE 5
    if (document.body)
        return document.body.clientHeight;
    // Just in case.
    return 0;
}

function resizeHandler() {
    var height = windowHeight();
    height -= document.getElementById('toolbar').offsetHeight - 30;
    document.getElementById('map').style.height = height + 'px';
    document.getElementById('sidebar').style.height = height + 'px';
}

test("getWindowHeight").should = function () {
    this.isEqual(643, windowHeight(), "The height in mozilla");
}

test("offsetHeight").should = function () {
    var testNode = addNewChild('parent', 'toolbar');

    var toolBar = document.getElementById('toolbar');
    this.isNotEqual(null, toolBar);
    
    toolBar.appendChild(textNode());
    
    this.isEqual('parent', testNode.id);
    this.isEqual(20, toolBar.offsetHeight);
}

test("validatesAddNewChild").should = function () {
    var actualNode = addNewChild('parent', 'toolbar');
    var expectedNode = document.getElementById('parent');

    this.isEqual(expectedNode, actualNode);
}

function textNode() {
    return document.createTextNode('some text');
}

function addNewChild(parentName, childName) {

    var parentNode = document.getElementById(parentName);
    
    var child = document.createElement('div');
    child.id = childName;

    parentNode.appendChild(child);

    return parentNode;
}













// Testing tests
//
//
//newTest("isNotEqual").Execute = function () {
//    this.isEqual(1, 2);
//}
//
//newTest("isNotEqualAgain").Execute = function () {
//    this.isEqual(1, 2);
//}
//
//newTest("isEqual").Execute = function () {
//    this.isEqual(1, 1);
//}
//
//newTest("should_haveNoFunction").Execute = function () {
//    this.isEqual(null, noFunction());
//}



