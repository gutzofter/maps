var markerHash={};
var currentFocus=false;
var googleService = newGoogleService();

function focusPoint(id){
    if (currentFocus) {
        Element.removeClassName("sidebar-item-"+currentFocus,"current");
    }
    Element.addClassName("sidebar-item-"+id,"current");
    markerHash[id].marker.openInfoWindowHtml(markerHash[id].address);
    currentFocus=id;
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

function filter(type){
    for(i=0;i<markers.length;i++) {
        var current = markers[i].tower;
        if (current.structure_type == type || 'All' == type) {
            Element.show("sidebar-item-" + current.id)
            if (!markerHash[current.id].visible) {
                googleService.addToOverlay(markerHash[current.id].marker);
                markerHash[current.id].visible=true;
            }
        } else {
            if (markerHash[current.id].visible) {
                googleService.removeFromOverlay(markerHash[current.id].marker);
                markerHash[current.id].visible=false;
            }
            Element.hide("sidebar-item-" + current.id)
        }
    }
}

function windowHeight() {
    // Standard browsers (Mozilla, Safari, etc.)
    if (self.innerHeight)
        return self.innerHeight;
    // IE 6
    if (document.documentElement && document.documentElement.clientHeight)
        return document.documentElement.clientHeight;
    // IE 5
    if (document.body)
        return document.body.clientHeight;
    // Just in case.
    return 0;
}

function handleResize() {
    var height = windowHeight() - $('toolbar').offsetHeight - 30;

    $('map').style.height = height + 'px';
    $('sidebar').style.height = height + 'px';
}

function init() {
    handleResize();

    googleService.defaultMap();

    for(i=0; i < markers.length; i++) {
        addToMarkerHash(markers[i].tower);
    }
    initHideShow();
    Element.hide('loading');
}

function initHideShow() {
    initHide();
    initShow();
}

function initHide() {
    if(isDOM()) {
        var sidebarControl = document.getElementById('sidebar-control-hide');

        if(sidebarControl) {
            var links = sidebarControl.getElementsByTagName('a');

            for( var i=0; i < links.length; i++ ){
                links[i].onclick = function(){
                    Element.addClassName('body','sidebar-off');
                };
            }
        }
    }
}

function initShow() {
    if(isDOM()) {
        var sidebarControl = document.getElementById('sidebar-control-show');

        if(sidebarControl) {
            var links = sidebarControl.getElementsByTagName('a');

            for( var i=0; i < links.length; i++ ){
                links[i].onclick = function(){
                    Element.removeClassName('body','sidebar-off');
                };
            }
        }
    }
}

function isDOM() {
    return (document.getElementById && document.getElementsByTagName);
}

function addToMarkerHash(current) {
    marker = addMarker(current.latitude, current.longitude, current.id);
    markerHash[current.id] = {
        marker: marker,
        address: current.address,
        visible: true
    };
}

function addMarker(latitude, longitude, id) {
    return googleService.addNewMarkerToOverlay(latitude, longitude, id);
}

Event.observe(window, 'load', init, false);
Event.observe(window, 'resize', handleResize, false);
