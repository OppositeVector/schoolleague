/**
 * Created by Peleg on 18/12/2015.
 */
google.maps.event.addDomListener(window, 'load', intilize);
function intilize() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("schoolSearch"));

    google.maps.event.addListener(autocomplete, 'place_changed', function () {

        var place = autocomplete.getPlace();
        var location = "Address: " + place.formatted_address + "<br/>";
        location += "Latitude: " + place.geometry.location.lat() + "<br/>";
        location += "Longitude: " + place.geometry.location.lng();
        document.getElementById('lblresult').innerHTML = location
    });

};
