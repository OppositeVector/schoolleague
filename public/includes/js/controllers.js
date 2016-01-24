/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http',
    function ($scope, $http) {
        initMap();
}]);

schoolsControllers.controller('filterSchoolsCtrl', ['$scope', '$http', '$routeParams', '$window',
    function ($scope, $http,  $routeParams, $window) {
        $http.get('/GetCity?name=' + $routeParams.name).success(function(data) {
            $scope.schools = data.data;

            $scope.theAddress = JSON.parse($window.sessionStorage.getItem("theAddress"));
            //console.log($scope.theAddress);
            //console.log($scope.theAddress.geometry.location.lat);
            //console.log($scope.theAddress.geometry.location.lng);
            //console.log($scope.theAddress.formatted_address);

            $scope.tempAddress = $scope.theAddress.formatted_address.split(",");
            //console.log($scope.tempAddress[0]);
            //myPosition($scope.theAddress.geometry.location, $scope.schools);
            filterMap($scope.schools, $scope.theAddress.geometry.location, $scope.tempAddress[0]);


            $scope.supervisionIncludes = [];

            $scope.includeSupervision = function(supervision) {
                var i = $.inArray(supervision, $scope.supervisionIncludes);
                if (i > -1) {
                    $scope.supervisionIncludes.splice(i, 1);
                } else {
                    $scope.supervisionIncludes.push(supervision);
                }

                //console.log($scope.schools[0].supervision);
                //console.log($scope.supervisionIncludes.length);
                //console.log($scope.supervisionIncludes[0]);
                //console.log($scope.schools.length);

                var newSchoolsArray = [];

                for(k=0 ; k<$scope.schools.length ; k++) {
                    for (j=0 ; j<3 ; j++) {
                        if ($scope.supervisionIncludes[j] == null) continue;
                        if ($scope.schools[k].supervision == $scope.supervisionIncludes[j])
                            newSchoolsArray.push($scope.schools[k]);
                    }
                }
                console.log(newSchoolsArray.length);
                if ($scope.supervisionIncludes[0] == null) filterMap($scope.schools,$scope.theAddress.geometry.location, $scope.tempAddress[0]);
                else filterMap(newSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
            }
        });
    }]);

schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('/GetSchool?id=' + $routeParams.schoolId).success(function(data) {
             console.log(data.data);
            $scope.school = data.data;
            GenerateC3Graph([data.data], [ 0, 1 ]);
        });

        function GenerateC3Graph(schools, params) {

            var rowsData = [];
            var criteria = filterCriteria; // This comes from includes/js/filterCriteria.js
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
                    //console.log(curr[j+1]);
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
                console.log('no active years');
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

                },
                size: {
                    height: 400
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
                        tick:{
                            format: function (x) { return x.getFullYear(); }
                        },

                    },
                    y: {
                        max: 100,
                        min: 10,
                        padding: {top:10, bottom:20}
                    }

                },
                size: {
                    height: 400
                }
            });

            $scope.legendItems = [];
            for(var i=0; i<rowsData.length-1 ; i++){
                $scope.legendItems.push({
                    id: rowsData[i+1][0],
                    checked: false
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
                    $scope.chart.toggle($scope.legendItems[i-1].id);
                }
            }
        }


        $http.get('/GetSchools').success(function(data) {
            $scope.schools = data.data;
        });

        $scope.tab = 1;

        $scope.toggleGraph = function (id, index) {
            $scope.chart.toggle(id);
            if ($scope.legendItems[index].checked == true)
                $scope.legendItems[index].checked = false;
            else $scope.legendItems[index].checked = true;
        }

        $scope.mouseOverGraph = function (id) {
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
}]);

