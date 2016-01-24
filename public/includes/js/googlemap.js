/**
 * Created by NatalieMenahem on 18/12/2015.
 */
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('google_map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 17,
        disableDefaultUI:true
    });
    var infoWindow = new google.maps.InfoWindow({map: map});
    var geocoder = new google.maps.Geocoder;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(pos);
            infoWindow.setPosition(pos);
            infoWindow.setContent('מיקומך כאן');
            map.setCenter(pos);
            geocodeLatLng(geocoder, map, infoWindow, pos.lat, pos.lng);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function geocodeLatLng(geocoder, map, infowindow, lat, lng) {
    var latlng = {lat: lat, lng: lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //infowindow.setContent(results[1].formatted_address);
                //console.log (results[1]);

                //if ($('#Autocomplete'))
                //    $('#Autocomplete').val(results[1].address_components[0].long_name)
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function timeCap(schools ,timeVal) {
     console.log(schools[0]);
    var newSchoolsArray = [];

}

function filterMap(schools, location, title) {
    //var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    //console.log('schools length:' + schools.length);

      // Display a map on the page and places the chosen position in a balloon
    map = new google.maps.Map(document.getElementById("google_map"), mapOptions, {
        center: {lat: location.lat, lng: location.lng},
        zoom: 17,
            disableDefaultUI:true
    });

    // Home Marker Info
    var infoBalloon = new google.maps.InfoWindow({content:title});

    // Home Marker Properties
    var image = '../../includes/images/homeMarker.png';
    marker = new google.maps.Marker({
        map: map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: {lat: location.lat, lng: location.lng},
        icon: image
    });

    // Allow Home marker to have an info window
    google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {
            infoBalloon.open(map, marker);
        }
    })(marker));

    //// Multiple Markers
    //var markers = [
    //    ['London Eye, London', 51.503454,-0.119562],
    //    ['Palace of Westminster, London', 51.499633,-0.124755]
    //];
    //
    //// Info Window Content
    //var infoWindowContent = [
    //    ['<div class="info_content">' +
    //    '<h3>London Eye</h3>' +
    //    '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
    //    ['<div class="info_content">' +
    //    '<h3>Palace of Westminster</h3>' +
    //    '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
    //    '</div>']
    //];


    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < schools.length ; i++ ) {
        if ((schools[i].position.lat == 360) || (schools[i].position.lon == 360)) continue;
        var position = new google.maps.LatLng(schools[i].position.lat, schools[i].position.lon);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: schools[i].name
        });

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(schools[i].name);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
        //console.log ("Obj Num:" + schools[i].position);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(15);
        google.maps.event.removeListener(boundsListener);
    });

}

function filterRoutes(startPoint, endPoints, transType) {
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    //var map;
    var start = new google.maps.LatLng(startPoint.lat, startPoint.lng);
    var end;


    endPoints.forEach(function(entry, i){
        end = new google.maps.LatLng(entry.position.lat, entry.position.lon);

        var request = {
            origin: start,
            destination: end,
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode[transType]
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                //console.log(response.routes[0].legs[0].duration.value);
                //timeRoute.push(response.routes[0].legs[0].duration.value);
                entry.duration = response.routes[0].legs[0].duration.value;
            }
        });
    });


    //function initialize() {
    //    directionsDisplay = new google.maps.DirectionsRenderer();
    //    directionsDisplay.setMap(map);
    //}

    //function calcRoute(transType) {
    //    for (i = 0; i<end.length; i++) {
    //        var request = {
    //            origin: start,
    //            destination: end[i],
    //            // Note that Javascript allows us to access the constant
    //            // using square brackets and a string value as its
    //            // "property."
    //            travelMode: google.maps.TravelMode[transType]
    //        };
    //
    //        directionsService.route(request, function (response, status) {
    //            if (status == google.maps.DirectionsStatus.OK) {
    //                //console.log(response.routes[0].legs[0].duration.value);
    //                //directionsDisplay.setDirections(response);
    //            }
    //        });
    //    }
    //}
    return endPoints;
    //initialize();
}
