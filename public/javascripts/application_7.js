var map;
var centerLatitude = 49.224773;
var centerLongitude = -122.991943;
var startZoom = 4;

function init() {
    map = new GMap2(document.getElementById("map"));
    map.addControl(new GSmallMapControl());
    map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
    updateMarkers();
    GEvent.addListener(map,'zoomend',function() {
        updateMarkers();
    });
    GEvent.addListener(map,'moveend',function() {
        updateMarkers();
    });
}

function updateMarkers() {
    //remove the existing points
    map.clearOverlays();
    //create the boundary for the data
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var url = '/chap_seven/cities_within_bounds?ne=' + northEast.toUrlValue() + '&sw=' + southWest.toUrlValue();
    //log the URL for testing
    GLog.writeUrl(url);
    //retrieve the points using Ajax
    var request = GXmlHttp.create();
    request.open('GET', url, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var data = request.responseText;
            var points = eval('('+data+')');
            //create each point from the list
            for (var i=0; i < points.length; i++) {
                var point = new GLatLng(points[i].lat,points[i].lng);
                var marker = createMarker(point,points[i].capital);
                map.addOverlay(marker);
            }
        }
    }
    request.send(null);
}

function createMarker(point, html) {
    var marker = new GMarker(point);
    GEvent.addListener(marker, 'click', function() {
        var markerHTML = html;
        marker.openInfoWindowHtml(markerHTML);
    });
    return marker;
}

window.onload = init;