var centerLatitude = 37.4419;
var centerLongitude = -122.1419;
var startZoom = 12;
var map;

function init() {
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map"));
        listMarkers();

        map.addControl(new GSmallMapControl());
        map.addControl(new GMapTypeControl());
        map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);

        GEvent.addListener(map, "click", function(overlay, latlng) {
            //create an HTML DOM form element
            var inputForm = document.createElement("form");
            inputForm.setAttribute("action","");
            inputForm.onsubmit = function() {
                createMarker(); return false;
            };
            //retrieve the longitude and lattitude of the click point
            var lng = latlng.lng();
            var lat = latlng.lat();
            inputForm.innerHTML = ''
            + '<fieldset style="width:150px;">'
            + '<legend>New Marker</legend>'
            + '<label for="found">Found</label>'
            + '<input type="text" id="found" name="m[found]" style="width:100%;"/>'
            + '<label for="left">Left</label>'
            + '<input type="text" id="left" name="m[left]" style="width:100%;"/>'
            + '<input type="submit" value="Save"/>'
            + '<input type="hidden" id="longitude" name="m[lng]" value="'+ lng +'"/>'
            + '<input type="hidden" id="latitude" name="m[lat]" value="' + lat + '"/>'
            + '</fieldset>';
            map.openInfoWindow (latlng, inputForm);
        });
    }
}

function listMarkers() {
    var request = GXmlHttp.create();
    //tell the request where to retrieve data from.
    var uri = encodeURI('chap_three/list');
    request.open('GET', uri, true);
    //tell the request what to do when the state changes.
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            //the request is complete
            var success = false;
            var markers = 'Error contacting web service';

            try {
                //parse the result to JSON (simply by eval-ing it)
                //The response is an array of markers
                res = eval( "(" + request.responseText + ")" );
                success = res.success;
                markers = res.content;
                for (var i = 0 ; i < markers.length ; i++) {
                    var marker = markers[i].marker
                    var lat = marker.lat;
                    var lng = marker.lng;
                    //check for lat and lng so MSIE does not error
                    //on parseFloat of a null value
                    if (lat && lng) {
                        var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));
                        var html = '<div><b>Found</b> '
                        + marker.found
                        + '</div><div><b>Left</b> '
                        + marker.left
                        + '</div>';
                        marker = addMarkerToMap(latlng, html);
                        map.addOverlay(marker);
                    }
                }
            }   
            catch (e) {
                alert('exception: ' + e.message);
                alert('exception: ' + e.lineNumber);
                success = false;
            }
            //check to see if it was an error or success
            if(!success) {
                alert('no success: ' + markers);
            }
        }
    }
    request.send(null);
    return false;
}

function encodeMarkerData(elements) {
    return ""
    + "?m[found]=" + elements.found
    + "&m[left]=" + elements.left
    + "&m[lng]=" + elements.lng
    + "&m[lat]=" + elements.lat;
}

function retrieveMarkerElements() {
    return {
        'found': document.getElementById("found").value,
        'left': document.getElementById("left").value,
        'lat': document.getElementById("latitude").value,
        'lng': document.getElementById("longitude").value
    };
}

function createMarker(){
    var markerElements = retrieveMarkerElements();
    var lng = markerElements.lng;
    var lat = markerElements.lat;

    var getVars =  encodeMarkerData(markerElements);

    var uri = encodeURI('chap_three/create' + getVars);
    var request = GXmlHttp.create();

    //call the create action back on the server
    request.open('GET', uri, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            //the request is complete
            var success = false;
            var content = 'Error contacting web service';
            try {
                //parse the result to JSON (simply by eval-ing it)
                res = eval( "(" + request.responseText + ")" );
                content = res.content;
                success = res.success;
            }
            catch (e) {
                success = false;
            }
            //check to see if it was an error or success
            if(!success) {
                alert('no success: ' + content);
            }
            else {
                //create a new marker and add its info window
                var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));
                var marker = addMarkerToMap(latlng, content);
                map.addOverlay(marker);
                map.closeInfoWindow();
            }
        }
    }            
    request.send(null);
    return false;
}

function addMarkerToMap(latlng, html) {
    var marker = new GMarker(latlng);
    GEvent.addListener(marker, 'click', function() {
        var markerHTML = html;
        marker.openInfoWindowHtml(markerHTML);
    });
    return marker;
}

function failMessage(e) {
    return '<p>Error Message: ' + e.message + '</p><p> [line number:' + e.lineNumber + ']</p>';
}


window.onload = init;
window.onunload = GUnload;