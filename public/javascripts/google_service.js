function newGoogleService() {
    var Google = new Object();

    Google.map = new Object();

    Google.centerLatitude = 19.5;
    Google.centerLongitude = -155.5;
    Google.zoom = 9;

    Google.addMarkerListener = function(marker, eventName, lambda) {
        GEvent.addListener(marker, eventName, lambda);
    }

    Google.defaultMap = function() {
        this.newMap("map");
        this.addSmallMapControl();
        this.centerMap();
    }

    Google.newMap = function(name) {
        this.map = new GMap($(name));
    }

    Google.addToOverlay = function(obj) {
        this.map.addOverlay(obj);
    }

    Google.removeFromOverlay = function(obj) {
        this.map.removeOverlay(obj);
    }

    Google.addSmallMapControl = function() {
        this.map.addControl(new GSmallMapControl());
    }

    Google.setMapCenter = function(lat, lng, zoom) {
        this.map.setCenter(new GLatLng(lat, lng), zoom);
    }

    Google.centerMap = function() {
        this.map.setCenter(new GLatLng(this.centerLatitude, this.centerLongitude), this.zoom);
    }

    Google.addNewMarkerToOverlay = function(lat, lng, id) {
        var marker = new GMarker(new GLatLng(lat, lng));
        this.addMarkerListener(marker, 'click',
            function() {
                focusPoint(id);
            } );

        this.addToOverlay(marker);
        return marker;
    }

    return Google;
}

