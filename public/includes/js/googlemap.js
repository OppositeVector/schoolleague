/**
 * Created by NatalieMenahem on 18/12/2015.
 */
function initMap() {
    var map = new google.maps.Map(document.getElementById('google_map'), {
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
                console.log (results[1]);

                if ($('#Autocomplete'))
                    $('#Autocomplete').val(results[1].address_components[0].long_name)
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
