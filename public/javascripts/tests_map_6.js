
test("returnExpecetdList").should = function () {
    var expectedList = [];

    var actualList = filterTowers('all', expectedList)

    this.isEqual(expectedList.size(), actualList.size());
}

test("findBuildTestTowersSize").should = function () {
    var expectedTowers = buildTestTowers();
    
    this.isEqual(3, expectedTowers.size(), "expectedList size should be 3");
}

test("findFilterTowersSize").should = function () {
    var visibleTowers = filterTowers('all', buildTestTowers())

    this.isEqual(3, visibleTowers.size(), "visibleTowers size should be 3");
}

test("filterForAll").should = function () {
    var visibleTowers = filterTowers('all', buildTestTowers())

    this.is(visibleTowers[0].isVisible);
    this.is(visibleTowers[1].isVisible);
    this.is(visibleTowers[2].isVisible);
}

test("filterForTypeb").should = function () {
    var visibleTowers = filterTowers('b', buildTestTowers())

    this.is(visibleTowers[0].isVisible);
    this.is(visibleTowers[1].isVisible);
    this.isNot(visibleTowers[2].isVisible);
}

test("filterForTypea").should = function () {
    var visibleTowers = filterTowers('a', buildTestTowers())

    this.is(visibleTowers[0].isVisible);
    this.is(visibleTowers[1].isVisible);
    this.isNot(visibleTowers[2].isVisible);
}

test("findBuildVisibilityListSize").should = function () {
    var visibility = buildVisibilityList(buildTestTowers());

    this.isEqual(3, visibility.size());
}

function buildVisibilityList(towers) {
    var col = [];
    var item = {};

    for( i = 0; i < towers.length; i++) {
        var tower = towers[i].tower;
            item['id'] = tower.id;
            item['isVisible'] = false;
            col.push(item);
    }
    return col;
}

function filterTowers(filter, towers) {
    var visible = buildVisibilityList(towers);
    for( i = 0; i < towers.length; i++) {
        var tower = towers[i].tower;
        if (filter == tower.type || filter == 'all') {
            visible[i].isVisible = true;
        }
    }
    return visible;
}

function buildTestTowers() {
    var one = { 'id': 1, 'type': 'a' };
    var two = { 'id': 2, 'type': 'a' };
    var three = { 'id': 3, 'type': 'b' };
    return [ {'tower': one}, {'tower': two}, {'tower': three}];
}

function filter(type){
    var visibleTowers = filterTowers(type, buildTestTowers())

    for(i=0; i < visibleTowers.length; i++) {
        var currentTower = visibleTowers[i];

        if(currentTower.isVisible) {
            Element.show("sidebar-item-" + current.id)
            map.addOverlay(markerHash[currentTower.id].marker);
            markerHash[currentTower.id].visible=true;
        }
        else {
            Element.hide("sidebar-item-" + current.id)
            map.removeOverlay(markerHash[current.id].marker);
            markerHash[current.id].visible=false;
        }
    }
}

