/**
 * Created by Peleg on 19/12/2015.
 */
function switchView() {
    if ($('#generalInfo').css('display') == "inline-block")
    {
        $('#generalInfo').css('display',  "none");
        $('#generalInfoFullView').css('display', 'inline-block');
    }
    else {
        $('#generalInfo').css('display',  "inline-block");
        $('#generalInfoFullView').css('display', 'none');
    }
}
