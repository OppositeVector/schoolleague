/**
 * Created by NatalieMenahem on 18/12/2015.
 */
var map;

var mapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d5d5d5"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "saturation": "-37"
            },
            {
                "lightness": "75"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            },
            {
                "saturation": "-2"
            },
            {
                "lightness": "53"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            },
            {
                "lightness": "69"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#7574c0"
            },
            {
                "saturation": "0"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#7574c0"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            },
            {
                "lightness": "25"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "38"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7574c0"
            },
            {
                "lightness": "51"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    }
];

function initMap() {
    map = new google.maps.Map(document.getElementById('google_map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 17,
        disableDefaultUI:true
    });

    map.set('styles', mapStyle);

    var geocoder = new google.maps.Geocoder;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            geocodeLatLng(geocoder, map, pos.lat, pos.lng);

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: '/includes/images/Location.svg'
            });
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function geocodeLatLng(geocoder, map, lat, lng) {
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
    map = new google.maps.Map(document.getElementById("google_map_filter"), mapOptions, {
        center: {lat: location.lat, lng: location.lng},
        zoom: 17,
        disableDefaultUI:true
    });

    map.set('styles', mapStyle);

    // Home Marker Info
    var infoBalloon = new google.maps.InfoWindow({content:title});

    // Home Marker Properties
    var image = '../../includes/images/Location.svg';
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
