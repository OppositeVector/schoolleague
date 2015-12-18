var app = angular.module("Parser",[]);

var model = {
	data: [ 
		[ "one", "two" ], 
		[ "three", "four" ] 
	] 
}

var allData = [];

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function ParseCSV(str, delim) {

	var strData = str;

    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (delim || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );

}

var fileBox;
// Great success! All the File APIs are supported.
console.log("File system API available");
fileBox = $("#fileBox");
fileBox.change(function(evt) {
	var files = evt.target.files; // FileList object
	console.log(evt.target.files);
	for(var i = 0; i < evt.target.files.length; ++i) {
		var f = evt.target.files[i];
		var reader = new FileReader();
		reader.onload = function(data) {
			var parsed = ParseCSV(data.target.result);
			var from = 0;
            var to = 20;
            var mIndex = 0;
			model.data.length = 0;

			for(var i = 0; i < parsed.length; ++i) {

                if((i >= from) && (i <= to)) {
                    model.data.push([]);
                }

				allData.push([]);

				for(var j = 0; j < parsed[i].length; ++j) {

                    if((i >= from) && (i <= to)) {
                        model.data[mIndex].push(parsed[i][j]);
                    }

					allData[i].push(parsed[i][j]);

				}

                if((i >= from) && (i <= to)) {
                    ++mIndex;
                }

			}

			console.log(model);

		}
		reader.readAsText(f);
	}
});

app.run(function() {

});

app.controller("BodyController", [ "$scope", "$http", function($scope, $http) {

	$scope.model = model;
	console.log(model);

	setInterval(function() {
        $scope.$apply() 
    }, 500);

    $("#send").click(function() {

        var index = 1;

        function SendCurrentSchool() {

            var res = $http.post("../test", allData[index]);
            res.success(function(data, status, headers, config) {
                if(data.result == 0) {
                    console.log("Falied on " + index);
                    console.log(data);
                    console.log(allData[index]);
                }
                ++index;
                if(index < allData.length) {
                    console.log("Sending " + index);
                    SendCurrentSchool();
                } else {
                    console.log("FINISHED");
                }
            });
            res.error(function(data, status, headers, config) {
                console.log(data);
            });

        }

        SendCurrentSchool();
    	
    });

}]);