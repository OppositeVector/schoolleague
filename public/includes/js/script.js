/**
 * Created by Peleg on 19/12/2015.
 */
//function switchView() {
//    if ($('#generalInfo').css('display') == "inline-block")
//    {
//        $('#generalInfo').css('display',  "none");
//        $('#generalInfoFullView').css('display', 'inline-block');
//    }
//    else {
//        $('#generalInfo').css('display',  "inline-block");
//        $('#generalInfoFullView').css('display', 'none');
//    }
//}


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

