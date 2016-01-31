/**
 * Created by Peleg on 19/12/2015.
 */


// CLEARABLE INPUT
function tog(v){return v?'addClass':'removeClass';}
$(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 > e.clientX-this.getBoundingClientRect().right)]('onX');
}).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
    $("#Autocomplete").blur();
    if ($('filterAutocomplete')){
        $("#filterAutocomplete").blur();
    }
});

