/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http',
    function ($scope, $http) {
        //$scope.flag=false;
        //
        //$http.get('http://localhost:8080/GetSchools').success(function(data) {
        //    $scope.schools = data.data;
        //    $scope.flag=false
        //
        //    console.log($scope.schools[0]);
        //});

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
            GenerateC3Graph(data.data, [ 0, 1 ]);
        });

        function GenerateC3Graph(school, params) {

            var rowsData = [];
            var criteria = filterCriteria; // This comes from includes/js/filterCriteria.js
            // var params = [2, 5, 7, 10]; // Determins the criterias to use
            var colors = {
                pattern: ['#F49292', '#FFDEDE',  '#CB5959', '#FFBEBE','#A22E2E']
            }

            rowsData.push(['x', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01']);
            for(var i = 0; i < params.length; ++i) {
                rowsData.push([null, null, null, null, null, null]); // reset year arrays
            }

            for(var i = 0; i < params.length; ++i) {

                var paramCriteria = criteria[params[i]];
                //console.log (paramCriteria);
                rowsData[i+1][0] = paramCriteria.hebName;
                for(var j = 0; j < school.claims.length; ++j) {
                    var total = 0;
                    for(var k = 0; k < paramCriteria.claims.length; ++k) {
                        //console.log("j= "+j + " k="+k+" "+school.claims[j].percent[paramCriteria.claims[k]]);
                        total += school.claims[j].percent[paramCriteria.claims[k]];
                    }
                    total /= paramCriteria.claims.length;
                    rowsData[i+1][school.claims[j].year - 2009 + 1] = Math.round(total);
                }
                //colors.pattern.push('#f49292');

            }
             $scope.chart = c3.generate({
                bindto: "#c3chart",
                data: {
                    x: "x",
                    columns: rowsData,
                    type: "area",
                    empty: {
                        label: {
                            text: "לא נבחרו קטגוריות"
                        }
                    },
                    labels: {
                        //format: function(v, id, i, j){
                        //    console.log(v);
                        //    console.log(id);
                        //    console.log(i);
                        //    console.log(j);
                        //    return id;
                        //}
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
                        padding: {left:0, right:0}
                    },
                    y: {
                        max: 100,
                        min: 0,
                        padding: {top:0, bottom:-10}
                    }

                },
            });

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
            for (var i=0; i<rowsData.length-1 ; i++){
                var curr = rowsData[i+1];
                for (var j=0 ; j<curr.length ; j++){
                    //console.log(curr[j+1]);
                    if(curr[j+1])
                        $scope.activeYears[j].active = true;

                }
            }

            //console.log (activeYears);

            $scope.legendItems = [];
            for(var i=0; i<rowsData.length-1 ; i++){

                //$scope.legendItems.push(rowsData[i+1][0]);
                $scope.legendItems.push({
                    id: rowsData[i+1][0],
                    checked: false
                });
            }
        }



        function GenerateGradesC3Graph(school) {

            var rowsData = [];
            var colors = {
                pattern: ['#F49292', '#FFDEDE',  '#CB5959', '#FFBEBE','#A22E2E']
            }

            rowsData.push(['x', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01', '2014-01-01']);


            //Classes X courses = 3 X 5 = 15
            for(var i = 0; i < 15; ++i) {
                rowsData.push([null, null, null, null, null, null, null, null]); // reset year arrays
            }

            var classB = [], bcounter = 0;
            var classE = [], ecounter = 0;
            var classH = [], hcounter = 0;

            for(var i = 0; i < school.grades.length; ++i) {
                var currentYear = school.grades[i];
                //class e
                if (currentYear.b){
                    classB.push({
                        year: currentYear.year
                    });

                    if (currentYear.b.english != -1){
                        classB[bcounter].english = currentYear.b.english;
                    }
                    if (currentYear.b.hebrew != -1){
                        classB[bcounter].hebrew = currentYear.b.hebrew;
                    }
                    if (currentYear.b.arabic != -1){
                        classB[bcounter].arabic = currentYear.b.arabic;
                    }
                    if (currentYear.b.math != -1){
                        classB[bcounter].math = currentYear.b.math;
                    }
                    if (currentYear.b.tech != -1){
                        classB[bcounter].tech = currentYear.b.tech;
                    }

                    bcounter++;
                }

                //class e
                if (currentYear.e){
                    classE.push({
                        year: currentYear.year
                    });

                    if (currentYear.e.english != -1){
                        classE[ecounter].english = currentYear.e.english;
                    }
                    if (currentYear.e.hebrew != -1){
                        classE[ecounter].hebrew = currentYear.e.hebrew;
                    }
                    if (currentYear.e.arabic != -1){
                        classE[ecounter].arabic = currentYear.e.arabic;
                    }
                    if (currentYear.e.math != -1){
                        classE[ecounter].math = currentYear.e.math;
                    }
                    if (currentYear.e.tech != -1){
                        classE[ecounter].tech = currentYear.e.tech;
                    }

                    ecounter++;
                }

                //class h
                if (currentYear.h){
                    classH.push({
                        year: currentYear.year
                    });

                    if (currentYear.h.english != -1){
                        classH[hcounter].hebrew = currentYear.h.hebrew;
                    }
                    if (currentYear.h.hebrew != -1){
                        classH[hcounter].hebrew = currentYear.h.hebrew;
                    }
                    if (currentYear.h.arabic != -1){
                        classH[hcounter].arabic = currentYear.h.arabic;
                    }
                    if (currentYear.h.math != -1){
                        classH[hcounter].math = currentYear.h.math;
                    }
                    if (currentYear.h.tech != -1){
                        classH[hcounter].tech = currentYear.h.tech;
                    }

                    hcounter++;
                }
            }

            console.log(classB);
            console.log(classE);
            console.log(classH);

            var newclassB = [], newbcounter = 0;
            var newclassE = [], newecounter = 0;
            var newclassH = [], newhcounter = 0;

            var courses = ['hebrew', 'english', 'arabic', 'tech', 'math'];

            if (classE[0] != null){
                for (var j=0; j<courses.length ; j++){
                    for(var i=0; i<classE.length ; i++){
                        if (classE[i][courses[j]] != null) {
                            console.log(courses[j]+" "+classE[i][courses[j]]);
                            rowsData[i+1][classE[i].year - 2009 + 1] = classE[i][courses[j]];
                        }
                    }
                }
            }

            console.log (rowsData);

            //for(var i = 0; i < params.length; ++i) {
            //
            //    var paramCriteria = criteria[params[i]];
            //    //console.log (paramCriteria);
            //    rowsData[i+1][0] = paramCriteria.hebName;
            //    for(var j = 0; j < school.claims.length; ++j) {
            //        var total = 0;
            //        for(var k = 0; k < paramCriteria.claims.length; ++k) {
            //            //console.log("j= "+j + " k="+k+" "+school.claims[j].percent[paramCriteria.claims[k]]);
            //            total += school.claims[j].percent[paramCriteria.claims[k]];
            //        }
            //        total /= paramCriteria.claims.length;
            //        rowsData[i+1][school.claims[j].year - 2009 + 1] = Math.round(total);
            //    }
            //    //colors.pattern.push('#f49292');
            //
            //}


            $scope.chart = c3.generate({
                bindto: "#c3chart",
                data: {
                    x: "x",
                    columns: rowsData,
                    type: "area",
                    empty: {
                        label: {
                            text: "לא נבחרו קטגוריות"
                        }
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
                        padding: {left:0, right:0}
                    },
                    y: {
                        max: 100,
                        min: 0,
                        padding: {top:0, bottom:0}
                    }

                },
            });

            $scope.legendItems = [];
            for(var i=0; i<rowsData.length-1 ; i++){
                //console.log(rowsData[i+1][0]);
                //$scope.legendItems.push(rowsData[i+1][0]);
                $scope.legendItems.push({
                    id: rowsData[i+1][0],
                    checked: false
                });
            }
        }




        $http.get('/GetSchools').success(function(data) {
            $scope.schools = data.data;
        });

        $scope.tab = 1;
        //$scope.innerTab = 0;

        $scope.toggleGraph = function (id, index) {
            $scope.chart.toggle(id);
            //console.log($('#checkbox_'+id));
            if ($scope.legendItems[index].checked == true)
                $scope.legendItems[index].checked = false
            else $scope.legendItems[index].checked = true;
        }

        $scope.mouseOverGraph = function (id) {
            $scope.chart.focus(id);
        }

        $scope.mouseOutGraph = function () {
            $scope.chart.revert();
        }


        $scope.calimsGraph = function (category, school) {
            console.log(criteria[category].name);
        };

        $scope.changeTab = function(tab) {
            $scope.tab = tab;
            switch (tab){
                case 1: {
                    GenerateC3Graph($scope.school, [ 0,1 ]);
                    break;
                }
                case 2: {
                    GenerateC3Graph($scope.school, [ 3,5,7,8 ]);
                    break;
                }
                case 3: {
                    GenerateGradesC3Graph($scope.school);
                    break;
                }
                case 4: {
                    GenerateC3Graph($scope.school, [ 9,6 ]);
                    break;
                }
                case 5: {
                    GenerateC3Graph($scope.school, [ 2,4 ]);
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

