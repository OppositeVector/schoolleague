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
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
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
        zoom: 13,
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
                infoWindow.setContent('<a href="#/getSchool/' + schools[i]._id +'">' + schools[i].name + '</a>');
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(13);
        google.maps.event.removeListener(boundsListener);
    });

}



function filterRoutes(startPoint, endPoints, transType) {
    var DistanceMatrixService = new google.maps.DistanceMatrixService();
    //var map;
    var start = new google.maps.LatLng(startPoint.lat, startPoint.lng);
    var destinations = [];


    endPoints.forEach(function(entry, i){
        destinations.push(new google.maps.LatLng(entry.position.lat, entry.position.lon));
    });

    //console.log(destinations);

    var d1 = [], d2 = [], d3 = [], d4=[], d5=[];

    if(destinations.length < 25) {
        d1 = destinations.slice(0,destinations.length);
    }

    if(destinations.length > 25 && destinations.length <= 50){
        d1 = destinations.slice(0,25);
        d2 = destinations.slice(25, destinations.length);
    }

    if(destinations.length > 50 && destinations.length <= 75){
        d1 = destinations.slice(0,25);
        d2 = destinations.slice(25, 50);
        d3 = destinations.slice(50, destinations.length);
    }

    if(destinations.length > 75 && destinations.length <= 100){
        d1 = destinations.slice(0,25);
        d2 = destinations.slice(25, 50);
        d3 = destinations.slice(50, 75);
        d4 = destinations.slice(75, destinations.length);
    }

    if(destinations.length > 100 && destinations.length <= 125){
        d1 = destinations.slice(0,25);
        d2 = destinations.slice(25, 50);
        d3 = destinations.slice(50, 75);
        d4 = destinations.slice(75, 100);
        d5 = destinations.slice(100, destinations.length);
    }

    if(d1[0] != null){
        DistanceMatrixService.getDistanceMatrix(
        {
            origins: [start],
            destinations: d1,
            travelMode: google.maps.TravelMode[transType],
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function(response, status){
                console.log(status);
                if (status == google.maps.DistanceMatrixStatus.OK) {
                    for(var i=0; i<d1.length ; i++){
                        if(d1[i].lng().toFixed(4) == endPoints[i].position.lon.toFixed(4) && d1[i].lat().toFixed(4) == endPoints[i].position.lat.toFixed(4)){
                            endPoints[i].duration = response.rows[0].elements[i].duration.value;
                        }
                    }
                }
            });
    }

    if(d2[0] != null){
        DistanceMatrixService.getDistanceMatrix(
        {
            origins: [start],
            destinations: d2,
            travelMode: google.maps.TravelMode[transType],
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function(response, status){
                console.log(status);

                if (status == google.maps.DistanceMatrixStatus.OK) {
                    for(var i=0; i<d2.length ; i++){
                        if(d2[i].lng().toFixed(4) == endPoints[i+25].position.lon.toFixed(4) && d2[i].lat().toFixed(4) == endPoints[i+25].position.lat.toFixed(4)){
                            endPoints[i+25].duration = response.rows[0].elements[i].duration.value;
                        }
                    }
                }
            });
    }

    if(d3[0] != null){
        DistanceMatrixService.getDistanceMatrix(
        {
            origins: [start],
            destinations: d3,
            travelMode: google.maps.TravelMode[transType],
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function(response, status){
                console.log(status);

                if (status == google.maps.DistanceMatrixStatus.OK) {
                    for(var i=0; i<d3.length ; i++){
                        if(d3[i].lng().toFixed(4) == endPoints[i+50].position.lon.toFixed(4) && d3[i].lat().toFixed(4) == endPoints[i+50].position.lat.toFixed(4)){
                            endPoints[i+50].duration = response.rows[0].elements[i].duration.value;
                        }
                    }
                }
            });
    }

    if(d4[0] != null){
        DistanceMatrixService.getDistanceMatrix(
        {
            origins: [start],
            destinations: d4,
            travelMode: google.maps.TravelMode[transType],
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function(response, status){
                console.log(status);

                if (status == google.maps.DistanceMatrixStatus.OK) {
                    for(var i=0; i<d4.length ; i++){
                        if(d4[i].lng().toFixed(4) == endPoints[i+75].position.lon.toFixed(4) && d4[i].lat().toFixed(4) == endPoints[i+75].position.lat.toFixed(4)){
                            endPoints[i+75].duration = response.rows[0].elements[i].duration.value;
                        }
                    }
                }
            });
    }

    if(d5[0] != null){
        DistanceMatrixService.getDistanceMatrix(
        {
            origins: [start],
            destinations: d5,
            travelMode: google.maps.TravelMode[transType],
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function(response, status){
                console.log(status);

                if (status == google.maps.DistanceMatrixStatus.OK) {
                    for(var i=0; i<d5.length ; i++){
                        if(d5[i].lng().toFixed(4) == endPoints[i+100].position.lon.toFixed(4) && d5[i].lat().toFixed(4) == endPoints[i+100].position.lat.toFixed(4)){
                            endPoints[i+100].duration = response.rows[0].elements[i].duration.value;
                        }
                    }

                }
            });
    }

    console.log(endPoints);
    return endPoints;

}
