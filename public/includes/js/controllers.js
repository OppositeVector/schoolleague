/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http',
    function ($scope, $http) {
        initMap();
}]);

schoolsControllers.controller('filterSchoolsCtrl', ['$scope', '$http', '$routeParams', '$window','$location', '$rootScope',
    function ($scope, $http,  $routeParams, $window, $location, $rootScope) {
        globalSchoolsArray = [];
        $scope.transType="DRIVING";
        $scope.timeVal="15";
        $http.get('/GetCity?name=' + $routeParams.name).success(function(data) {

            $scope.state = {
                name: 'state',
                checked: true
            };

            $scope.religious = {
                name: 'religious',
                checked: true
            };

            $scope.orthodox = {
                name: 'orthodox',
                checked: true
            };




            $scope.schools = data.data;
            globalSchoolsArray = angular.copy($scope.schools);

            //Getting user's address
            $scope.theAddress = JSON.parse($window.sessionStorage.getItem("theAddress"));
            $scope.tempAddress = $scope.theAddress.formatted_address.split(",");

            //Gets duration per school
            globalSchoolsArray = filterRoutes($scope.theAddress.geometry.location, globalSchoolsArray, $scope.transType);

            //Filters by supervision
            $scope.supervisionIncludes = [$scope.state.name, $scope.religious.name, $scope.orthodox.name];

            labelsFiltered = false;


            $scope.onStart = function (){
                //Shows markers on map
                $('#page-wrapper').hide();
                $('#google_map_filter').show();
                filterMap(globalSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
            }

            $scope.onStart();


            //Show schools buildings function
            $scope.showTopFive = function(labels, schools){

                console.log(schools.length);
                var rowsData = [];


                for(var i = 0; i < labels.length; i++) {
                    var row =[]
                    for(var j =0; j<schools.length +1 ; j++){
                        row.push(null);
                    }
                    rowsData.push(row);
                }

                var localWeights = weights[labels.length - 1];

                schools = schools.reverse();

                for(var l=0; l<labels.length ; l++){
                    rowsData[l][0] = labels[l];
                    for (var i=0 ; i<schools.length; i++){
                        rowsData[l][i+1] = schools[i].perLabelGrades[l] * localWeights[l];
                    }
                }

                var schoolNames = []
                for (var i=0 ; i<schools.length; i++){
                    schoolNames.push(schools[i].name);
                }

                var chart = c3.generate({
                    bindto: "#topFive",
                    data: {
                        columns: rowsData,
                        type: 'bar',
                        groups: [labels],
                        onclick: function (d, element) {
                            $location.path( '/getSchool/' + schools[d.index]._id );
                            $scope.$apply();
                        }
                    },
                    grid: {
                        y: {
                            lines: [{value:0}]
                        }
                    },
                    tooltip: {
                        show: false
                    },
                    legend: {
                        show: false
                    },
                    bar: {
                        width: {
                            ratio: 0.8
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: schoolNames
                        }
                    },
                    grid: {
                        x: {
                            show: false,

                        },
                        y: {
                            show: false
                        }
                    }
                });

                $('#topFive svg').attr('id', 'topFiveSvg');


                var svg = d3.select("#topFiveSvg");

                //squares
                var texture1 = textures.paths()
                    .d("squares")
                    .stroke("#9cdfd9");


                //Diagonal stripes
                var texture2 = textures.lines()
                    .heavier()
                    .stroke('#9cdfd9');

                //vertical thin
                var texture3 = textures.lines()
                    .orientation("vertical")
                    .strokeWidth(2)
                    .stroke('#9cdfd9');


                //blue print grid
                var texture4 = textures.lines()
                    .orientation("vertical", "horizontal")
                    .size(15)
                    .strokeWidth(1)
                    .stroke('#9cdfd9');

                //squares
                var texture5 = textures.lines()
                    .orientation("vertical", "horizontal")
                    .size(4)
                    .strokeWidth(1)
                    .background('#9cdfd9')
                    .stroke('#fff');

                svg.call(texture1);
                svg.call(texture2);
                svg.call(texture3);
                svg.call(texture4);
                svg.call(texture5);


                //adding textures to graph
                for(var l=0; l<labels.length ; l++){
                    var shapes = $('#topFive .c3-target-' + labels[l] + ' g path');
                    for(var i= 0 ; i<shapes.length; i++){
                        switch (l){
                            case 0: {
                                //console.log(texture1.url());
                                shapes[i].style.fill = texture1.url();
                                shapes[i].style.stroke = "#9cdfd9";
                                shapes[i].style.strokeWidth = "4";
                                break;
                            }
                            case 1:{
                                shapes[i].style.fill = texture5.url();
                                shapes[i].style.stroke = "#9cdfd9";
                                shapes[i].style.strokeWidth = "4";
                                break;
                            }
                            case 2:{
                                shapes[i].style.fill = texture4.url();
                                shapes[i].style.stroke = "#9cdfd9";
                                shapes[i].style.strokeWidth = "4";
                                break;
                            }
                            case 3:{
                                shapes[i].style.fill = texture2.url();
                                shapes[i].style.stroke = "#9cdfd9";
                                shapes[i].style.strokeWidth = "4";
                                break;
                            }
                            case 4:{
                                shapes[i].style.fill = texture3.url();
                                shapes[i].style.stroke = "#9cdfd9";
                                shapes[i].style.strokeWidth = "4";
                                break;
                            }
                        }
                    }
                }


                //Adding textures to legends
                var legends = $('#labelsList li .itemName img');
                for(var i=0; i<legends.length ; i++){
                    switch (i){
                        case 0: {
                            $(legends[i]).attr("src","/includes/images/bigSquaresTexture.png");
                            break;
                        }
                        case 1:{
                            $(legends[i]).attr("src","/includes/images/smallSquaresTexture.png");
                            break;
                        }
                        case 2:{
                            $(legends[i]).attr("src","/includes/images/bluePrintTexture.png");
                            break;
                        }
                        case 3:{
                            $(legends[i]).attr("src","/includes/images/diagonalStripesTexture.png");
                            break;
                        }
                        case 4:{
                            $(legends[i]).attr("src","/includes/images/verticalStripesTexture.png");
                            break;
                        }
                    }
                }
            };


            //Filters by supervision type
            $scope.includeSupervision = function(supervision) {
                var i = $.inArray(supervision.name, $scope.supervisionIncludes);
                if (i > -1) {
                    $scope.supervisionIncludes.splice(i, 1);
                    supervision.checked = false;
                } else {
                    $scope.supervisionIncludes.push(supervision.name);
                    supervision.checked = true;
                }

                $scope.getByDuration();
            }

            //Filter by mode of travel
            $scope.changeTravelType = function(){
                globalSchoolsArray = filterRoutes($scope.theAddress.geometry.location, globalSchoolsArray, $scope.transType);
                $scope.getByDuration();
            }

            //Filter by time of travel
            $scope.getByDuration = function() {
                var localSchoolsArray = [];
                for (var k = 0; k < globalSchoolsArray.length; k++) {
                    // If exist - for schools with no location data
                    if (globalSchoolsArray[k].duration) {
                        // Checks if the duration is less or equals the timeVal AND whether it applies to current filters (supervision)
                        if ($scope.supervisionIncludes[0] != null) {
                            for (var j = 0; j < $scope.supervisionIncludes.length; j++) {
                                //if ($scope.supervisionIncludes[j] == null) continue;
                                if ((globalSchoolsArray[k].duration / 60 <= $scope.timeVal) && (globalSchoolsArray[k].supervision == $scope.supervisionIncludes[j])) localSchoolsArray.push(globalSchoolsArray[k]);
                            }
                        }
                        // Filters only by duration (supervision is unchecked)
                        else if (globalSchoolsArray[k].duration / 60 <= $scope.timeVal) localSchoolsArray.push(globalSchoolsArray[k]);
                    }
                }

                //localSchoolsArray = localSchoolsArray.slice(0,5);
                console.log(localSchoolsArray);
                // Checked whether filter by grade is initiated
                if (labelsFiltered == true){
                    localSchoolsArray = localSchoolsArray.slice(0, 5);
                    filterMap(localSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
                    $window.sessionStorage.setItem("topFiveSchools", JSON.stringify(localSchoolsArray));
                    $scope.showTopFive($scope.labels, localSchoolsArray);
                }
                else {
                    if(localSchoolsArray.length == 0){
                        $scope.notifications();
                        filterMap(localSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
                    }
                    else {
                        $scope.hideNotifications();
                        filterMap(localSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
                    }
                }
            }

            // Drag&Drop + Sorting Algorithm
            sortable = Sortable.create(labelsList, {
                group: {
                    name: "labelsList",
                    put: ['poolList'],
                    pull: true
                },
                animation: 150,
                store: {
                    get: function (sortable) {
                        var order = localStorage.getItem(sortable.options.group);
                        return order ? order.split('|') : [];
                    },
                    set: function (sortable) {
                        var order = sortable.toArray();
                        localStorage.setItem(sortable.options.group, order.join('|'));
                    }
                },
                onAdd: function (evt) {
                    if (sortable.toArray().length >= 5) {
                        sortable.options.group.put = false;
                    }
                    else {
                        sortable.options.group.put = ['poolList'];
                    }
                },
                onUpdate: function (evt){

                },
                onRemove: function (evt){
                    if (sortable.toArray().length >= 5) {
                        sortable.options.group.put = false;
                    }
                    else {
                        sortable.options.group.put = ['poolList'];
                    }
                },
                onStart:function(evt) {
                },
                onSort:function(evt){
                    console.log(sortable.toArray());
                    if (sortable.toArray().length > 0) {
                        $scope.hideNotifications();
                        $('#google_map_filter').hide();
                        $('#page-wrapper').show();
                        labelsFiltered = true;
                        $scope.labelFilter(sortable.toArray());
                    }
                    else {
                        labelsFiltered = false;
                        d3.select("#topFiveSvg").remove();
                        $scope.notifications();
                    }
                },
                onEnd: function(evt) {
                }
            });


            Sortable.create(poolList, {
                group: {
                    name: "poolList",
                    put: ['labelsList']
                },
                animation: 150
            });

            // Drag&Drop weights
            var weights = [
                [ 1.0 ],
                [ 0.6, 0.4 ],
                [ 0.5, 0.3, 0.20 ],
                [ 0.45, 0.25, 0.20, 0.10 ],
                [ 0.40, 0.20, 0.175, 0.125, 0.10 ]
            ]

            // Claims are offset by -1 because the first claim stands on index 0, but its name is claim1
            $scope.criteria = [
                {
                    name: "Student Safety",
                    hebName: 'בטיחות',
                    id: "sSft",
                    claims: [ 3, 11, 17, 24, 33, 34, 43, 46, 47, 52, 53, 60, 62, 70, 76 ]
                },
                {
                    name: "Teachers Satisfaction",
                    hebName: 'שביעות רצון המורים',
                    id: "tSat",
                    claims: [ 0, 5, 13, 36, 48, 68 ]
                },
                {
                    name: "Student Satisfaction",
                    hebName: 'שביעות רצון התלמידים',
                    id: "sSat",
                    claims: [ 44, 45, 58, 63 ]
                },
                {
                    name: "Social Attitude and Activities",
                    hebName: 'יחס חברתי',
                    id: "soAttAct",
                    claims: [ 4, 14, 20, 28, 30, 40, 50, 51, 64, 69 ]
                },
                {
                    name: "School Attitude on Violence",
                    hebName: 'יחס בי״ס לאלימות',
                    id: "schAttVio",
                    claims: [ 1, 12, 71, 72, 77 ]
                },
                {
                    name: "Class Management",
                    hebName: 'התנהלות הכיתה',
                    id: "clMng",
                    claims: [ 18, 57, 78 ]
                },
                {
                    name: "Teacher Personal Treatment",
                    hebName: 'יחס המורים',
                    id: "tPrsTrt",
                    claims: [ 8, 16, 22, 25, 26, 27, 31, 39, 49, 54, 66, 80 ]
                },
                {
                    name: "Teacher Learning Treatment",
                    hebName: 'השקעת המורים',
                    id: "tLrnTrt",
                    claims: [ 2, 9, 10, 15, 19, 32, 35, 37, 38, 41, 55, 56, 61, 65, 67, 74, 75 ]
                },
                {
                    name: "Student Attitude Towards School",
                    hebName: 'יחס התלמידים',
                    id: "sAttSch",
                    claims: [ 29, 42, 79 ]
                },
                {
                    name: "Differential Learning",
                    hebName: 'למידה דיפרנציאלית',
                    id: "difLrn",
                    claims: [ 6, 7, 21, 23, 59, 73 ]
                }
            ]

           //Filters by labels
           $scope.labelFilter = function(labels){

               $scope.labels = labels;

               // Creating a local criteria array
               var localCriteria =[];
               for (var l=0 ; l< labels.length ; l++){
                    for (var c=0 ; c <$scope.criteria.length ; c++ ) {
                        if (labels[l] == $scope.criteria[c].id) {
                            localCriteria.push($scope.criteria[c]);
                            continue;
                        }
                    }
               }
               //console.log(localCriteria);
               //console.log(localCriteria.length);

               // Creating a local weights array
               var localWeights = [];
               localWeights = weights[localCriteria.length - 1];
               console.log(localWeights);


               //console.log(localCriteria[0].claims.length);
               console.log(globalSchoolsArray[12]);
               localSchoolsScoresPerLabel = [];
               $scope.localSchoolsScoresFinal = [];
                for (var s = 0 ; s < globalSchoolsArray.length ; s++) {
                    var tempClaimSumArr = [];
                    var tempCriteria = 0;
                    for (l = 0 ; l < localCriteria.length ; l++) {
                        var tempClaimSum = 0;
                        var lastYear = globalSchoolsArray[s].claims.length - 1;
                        for (c = 0 ; c < localCriteria[l].claims.length ; c++) {
                            if (globalSchoolsArray[s].claims.length == 0) continue;
                            if(globalSchoolsArray[s].claims[lastYear].percent[localCriteria[l].claims[c]] == -1) continue;
                            tempClaimSum += globalSchoolsArray[s].claims[lastYear].percent[localCriteria[l].claims[c]];
                        }
                        tempClaimSum /= localCriteria[l].claims.length;
                        //tempAverage += (tempClaimSum / localCriteria[l].claims.length);
                        //console.log(tempClaimSum);

                        //Student safety - the 'positive' side of the grade
                        if (localCriteria[l].id == 'sSft' && tempClaimSum != 0) tempClaimSum = 100 - tempClaimSum;

                        tempClaimSumArr.push(tempClaimSum);
                    }
                    // Summed grade per criteria for each school
                    localSchoolsScoresPerLabel.push(tempClaimSumArr);
                    //console.log('School ' + s + ' has those grades: ' + localSchoolsScoresPerLabel[s]);
                    for (var w = 0 ; w < localWeights.length ; w++) {
                        //console.log('S = ' + s + ": ");
                        //console.log(tempClaimSumArr[w]);
                        //console.log(tempClaimSumArr[w] * localWeights[w]);
                        tempCriteria += (tempClaimSumArr[w] * localWeights[w]);
                        //console.log(tempCriteria);
                    }
                    // Summed total weighted grade for each school (not criteria)
                    $scope.localSchoolsScoresFinal.push(tempCriteria);
                    //console.log('School ' + s + 's final grade is: ' + localSchoolsScoresFinal[s]);
                }

               // Adds two more fields to the globalSchoolsArray - Final grade (for each school) and array of criteria's gardes (for each school)
               globalSchoolsArray.forEach(function (entry, i) {
                   entry.calculatedGrade = $scope.localSchoolsScoresFinal[i];
                   entry.perLabelGrades = localSchoolsScoresPerLabel[i];
               });

               // Sorting the globalSchoolsArray grades
               //$scope.sortedSchoolsArray = angular.copy(globalSchoolsArray);
               globalSchoolsArray.sort(function(a, b) {
                   return parseFloat(b.calculatedGrade) - parseFloat(a.calculatedGrade);
               });

               //$scope.sortedSchoolsArray = $scope.sortedSchoolsArray.slice(0, 5);

               $scope.getByDuration();


               // Styling selected tags
               var selectedClaims = $('#labelsList li');
               for (var i = 0; i<selectedClaims.length ; i++){
                   switch (localWeights[i]){
                       case 1.0:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border100'); break;
                       }
                       case 0.6:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border60'); break;
                       }
                       case 0.5:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border50'); break;
                       }
                       case 0.45:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border45'); break;
                       }
                       case 0.4:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border40'); break;
                       }
                       case 0.30:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border30'); break;
                       }
                       case 0.25:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border25'); break;
                       }
                       case 0.20:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border20'); break;
                       }
                       case 0.175:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border17'); break;
                       }
                       case 0.125:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border12'); break;
                       }
                       case 0.10:{
                           $(selectedClaims[i]).removeClass();
                           $(selectedClaims[i]).addClass('ng-scope border10'); break;
                       }
                   }

               }

            }

            $scope.mapView = function(){
                $('#google_map_filter').show();
                $scope.getByDuration();
                $('#page-wrapper').hide();
            };

            $scope.listView = function(){
                $('#google_map_filter').hide();
                $('#page-wrapper').show();
                $scope.getByDuration();

                if(labelsFiltered == false){
                    $scope.notifications();
                }
            };

            $scope.notifications = function(){
              if($('#google_map_filter').is(":visible")){
                  $('#noDataLabeled').hide();
                  $('#noSearchResults').show();
              }
                else if($('#page-wrapper').is(":visible")){
                  $('#noDataLabeled').show();
                  $('#noSearchResults').hide();
              }
            };

            $scope.hideNotifications = function(){
                    $('#noDataLabeled').hide();
                    $('#noSearchResults').hide();
            };
         });
    }]);


//School info page controller
schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams', '$location',
    function ($scope, $http, $routeParams, $location) {
        $http.get('/GetSchool?id=' + $routeParams.schoolId).success(function(data) {
            $scope.school = data.data;
            GenerateC3Graph([data.data], [ 0, 1 ]);
        });

        function GenerateC3Graph(schools, params) {

            var rowsData = [];
            var criteria = filterCriteria;
            var colorBank = [
                '#c03c3c', '#f87e7e',
                '#c94848','#f49292','#f05656',];
            var colors = {
                pattern: [
                    '#c03c3c', '#f87e7e',
                    '#c94848','#f49292','#f05656',
                ]
            }

            rowsData.push(['x', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01']);
            for(var i = 0; i < params.length * schools.length; ++i) {
                rowsData.push([null, null, null, null, null, null]); // reset year arrays
            }

            var dataIndex = 1;
            for(var s = 0; s< schools.length; ++s)
            {
                var school = schools[s];
                var currentColor = colorBank[s];
                for(var i = 0; i < params.length; ++i) {

                    var paramCriteria = criteria[params[i]];
                    rowsData[dataIndex][0] = ((schools.length > 1) ? school.name + " - " : "") + paramCriteria.hebName;
                    for(var j = 0; j < school.claims.length; ++j) {
                        var total = 0;
                        for(var k = 0; k < paramCriteria.claims.length; ++k) {
                            total += school.claims[j].percent[paramCriteria.claims[k]];
                        }
                        total /= paramCriteria.claims.length;
                        rowsData[i+1][school.claims[j].year - 2009 + 1] = Math.round(total);
                    }
                    colors.pattern.push(currentColor);
                    ++dataIndex;
                }
            }

            console.log(rowsData);
            $scope.activeYears = [
                {
                    year: 2009,
                    active: false
                },
                {
                    year: 2010,
                    active: false
                },
                {
                    year: 2011,
                    active: false
                },
                {
                    year: 2012,
                    active: false
                },
                {
                    year: 2013,
                    active: false
                },
                {
                    year: 2014,
                    active: false
                }
            ]

            var activeNum = 0;
            for (var i=0; i<rowsData.length-1 ; i++){
                var curr = rowsData[i+1];
                for (var j=0 ; j<curr.length-1 ; j++){
                    if(curr[j+1] != null && curr[j+1] != -1)
                    {
                        $scope.activeYears[j].active = true;
                    }

                }
            }

            for (var i = 0 ; i< $scope.activeYears.length ; i++){
                if ($scope.activeYears[i].active == true)
                    activeNum++;
            }

            $scope.legendItems = [];
            for(var i=0; i<rowsData.length-1 ; i++){
                $scope.legendItems.push({
                    id: rowsData[i+1][0],
                    checked: false
                });
            }

            var noDataMsg = "לא נבחרו קטגוריות";
            //In case there is no data
            if (activeNum == 0){
                noDataMsg = "אין מידע על בי״ס";
            }

            $scope.chart = c3.generate({
                bindto: "#c3chart",
                data: {
                    x: "x",
                    columns: rowsData,
                    type: "area",
                    empty: {
                        label: {
                            text: noDataMsg
                        }
                    },
                    labels: {}
                },
                point: {
                    show: false
                },
                color: colors,
                line: {
                    connectNull: true
                },
                legend: {
                    show: false
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick:{
                            format: function (x) { return x.getFullYear(); }
                        }
                    },
                    y: {
                        max: 100,
                        min: 0,
                        padding: {top:10, bottom:-10}
                    }

                }
            });

            //In case there's only one year of data
            if (activeNum == 1){
                $scope.chart.transform('bar');
            }

            //No data
            if (activeNum == 0){
                for (var i = 0; i<$scope.legendItems.length ; i++){
                    $scope.chart.toggle($scope.legendItems[i].id);
                    $scope.legendItems[i].checked = true;
                }
            }


        }


        function GenerateGradesC3Graph(school) {

            var rowsData = [];
            var colors = {
                pattern: ['#f87e7e', '#f49292', '#f05656','#c94848','#c03c3c',]
            }

            rowsData.push(['x', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01']);

            for(var i = 0; i < 5; ++i) {
                rowsData.push([null, 0, 0, 0, 0, 0]); // reset year arrays
            }

            var acounter2 = 1;
            var hcounter2 = 1;
            var ecounter2 = 1;
            var tcounter2 = 1;
            var mcounter2 = 1;

            rowsData[1][0] = 'אנגלית';
            rowsData[2][0] = 'עברית';
            rowsData[3][0] = 'ערבית';
            rowsData[4][0] = 'מתמטיקה';
            rowsData[5][0] = 'טכנולוגיה';

            for(var i = 0; i < school.grades.length; ++i) {
                var currentYear = school.grades[i];

                if (currentYear.b){

                    if (currentYear.b.english != -1){
                        rowsData[1][currentYear.year-2009+1] = (rowsData[1][currentYear.year-2009+1]+ currentYear.b.english)/ecounter2;
                        ecounter2++;
                    }
                    if (currentYear.b.hebrew != -1){
                        rowsData[2][currentYear.year-2009+1] = (rowsData[2][currentYear.year-2009+1]+ currentYear.b.hebrew)/hcounter2;
                        hcounter2++;
                    }
                    if (currentYear.b.arabic != -1){
                        rowsData[3][currentYear.year-2009+1] = (rowsData[3][currentYear.year-2009+1]+ currentYear.b.arabic)/acounter2;
                        acounter2++;
                    }
                    if (currentYear.b.math != -1){
                        rowsData[4][currentYear.year-2009+1] = (rowsData[4][currentYear.year-2009+1]+ currentYear.b.math)/mcounter2;
                        mcounter2++;
                    }
                    if (currentYear.b.tech != -1){
                        rowsData[5][currentYear.year-2009+1] = (rowsData[5][currentYear.year-2009+1]+ currentYear.b.tech)/tcounter2;
                        tcounter2++;
                    }
                }

                if (currentYear.e){

                    if (currentYear.e.english != -1){
                        rowsData[1][currentYear.year-2009+1] = (rowsData[1][currentYear.year-2009+1]+ currentYear.e.english)/ecounter2;
                        ecounter2++;
                    }
                    if (currentYear.e.hebrew != -1){
                        rowsData[2][currentYear.year-2009+1] = (rowsData[2][currentYear.year-2009+1]+ currentYear.e.hebrew)/hcounter2;
                        hcounter2++;
                    }
                    if (currentYear.e.arabic != -1){
                        rowsData[3][currentYear.year-2009+1] = (rowsData[3][currentYear.year-2009+1]+ currentYear.e.arabic)/acounter2;
                        acounter2++;
                    }
                    if (currentYear.e.math != -1){
                        rowsData[4][currentYear.year-2009+1] = (rowsData[4][currentYear.year-2009+1]+ currentYear.e.math)/mcounter2;
                        mcounter2++;
                    }
                    if (currentYear.e.tech != -1){
                        rowsData[5][currentYear.year-2009+1] = (rowsData[5][currentYear.year-2009+1]+ currentYear.e.tech)/tcounter2;
                        tcounter2++;
                    }
                }

                if (currentYear.h){

                    if (currentYear.h.english != -1){
                        rowsData[1][currentYear.year-2009+1] = (rowsData[1][currentYear.year-2009+1]+ currentYear.h.english)/ecounter2;
                        ecounter2++;
                    }
                    if (currentYear.h.hebrew != -1){
                        rowsData[2][currentYear.year-2009+1] = (rowsData[2][currentYear.year-2009+1]+ currentYear.h.hebrew)/hcounter2;
                        hcounter2++;
                    }
                    if (currentYear.h.arabic != -1){
                        rowsData[3][currentYear.year-2009+1] = (rowsData[3][currentYear.year-2009+1]+ currentYear.h.arabic)/acounter2;
                        acounter2++;
                    }
                    if (currentYear.h.math != -1){
                        rowsData[4][currentYear.year-2009+1] = (rowsData[4][currentYear.year-2009+1]+ currentYear.h.math)/mcounter2;
                        mcounter2++;
                    }
                    if (currentYear.h.tech != -1){
                        rowsData[5][currentYear.year-2009+1] = (rowsData[5][currentYear.year-2009+1]+ currentYear.h.tech)/tcounter2;
                        tcounter2++;
                    }
                }
                acounter2 = 1, ecounter2 = 1, hcounter2 = 1, tcounter2 = 1, mcounter2 = 1;
            }

            console.log (rowsData);

            for(var i = 1 ; i<rowsData.length ; i++){
                for(var j=1; j<rowsData[i].length ; j++){
                    if(rowsData[i][j] != 0)
                        rowsData[i][j] = rowsData[i][j]*10;
                }
            }

            $scope.chart = c3.generate({
                bindto: "#c3chart",
                data: {
                    x: "x",
                    columns: rowsData,
                    type: "bar",
                    empty: {
                        label: {
                            text: "לא נבחרו קטגוריות"
                        }
                    },
                    labels: {
                        format: function (v, id, i, j) { return id; }
                    }
                },
                point: {
                    show: false
                },
                color: colors,
                line: {
                    connectNull: true
                },
                legend: {
                    show: false
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: function (x) {
                                return x.getFullYear();
                            }
                        },

                    },
                    y: {
                        max: 100,
                        min: 10,
                        padding: {top: 10, bottom: 20}
                    }

                }
            });

            $scope.legendItems = [];
            for(var i=0; i<rowsData.length-1 ; i++){
                $scope.legendItems.push({
                    id: rowsData[i+1][0],
                    checked: false,
                    disabled: false
                });
            }

            var activeYears = 0;

            for(var i = 1 ; i<rowsData.length ; i++){
                activeYears = 0;
                for(var j=1; j<rowsData[i].length ; j++){
                    if(rowsData[i][j] != 0){
                        activeYears++;
                    }
                }
                if (activeYears == 0){
                    $scope.legendItems[i-1].checked = true;
                    $scope.legendItems[i-1].disabled = true;
                    $scope.chart.toggle($scope.legendItems[i-1].id);
                }
            }
        }


        $http.get('/GetSchools').success(function(data) {
            $scope.schools = data.data;
        });

        $scope.tab = 1;

        $scope.toggleGraph = function (id, index) {
            if($scope.legendItems[index].disabled) return;
            $scope.chart.toggle(id);
            if ($scope.legendItems[index].checked == true)
                $scope.legendItems[index].checked = false;
            else $scope.legendItems[index].checked = true;
        }

        $scope.mouseOverGraph = function (id, index) {
            if($scope.legendItems[index].disabled) return;
            $scope.chart.focus(id);
        }

        $scope.mouseOutGraph = function () {
            $scope.chart.revert();
        }

        $scope.changeTab = function(tab) {
            $scope.tab = tab;
            switch (tab){
                case 1: {
                    GenerateC3Graph([$scope.school], [ 0,1 ]);
                    break;
                }
                case 2: {
                    GenerateC3Graph([$scope.school], [ 3,5,7,8 ]);
                    break;
                }
                case 3: {
                    GenerateGradesC3Graph($scope.school);
                    break;
                }
                case 4: {
                    GenerateC3Graph([$scope.school], [ 9,6 ]);
                    break;
                }
                case 5: {
                    GenerateC3Graph([$scope.school], [ 2,4 ]);
                    break;
                }
            }
        };

        $scope.isSelectedTab = function(tab) {
            return $scope.tab === tab;
        }

        $scope.togglePopUp = function(){
            $('#comparePopUp').toggle();
        }

        $scope.goToCompare = function() {
            $location.path( '/schoolCompare' );
        }
}]);

schoolsControllers.controller('schoolCompareCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.schools = [
            {
                name: "בית ספר יבנה"
            },
            {
                name: "בית ספר הדר"
            },
            {
                name: "בית ספר זיו"
            }
        ]
    }
]);
