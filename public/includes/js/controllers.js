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
        $http.get('http://localhost:8080/GetCity?name=' + $routeParams.name).success(function(data) {
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
            // console.log(data.data);
            $scope.school = data.data;
            // calimsGraph(0, $scope.school);
            // generateGraph();
            // generateGraph2();
            GenerateC3Graph(data.data, [ 2, 5, 7, 10 ]);
        });

        function GenerateC3Graph(school, params) {

            var rowsData = [];
            var criteria = filterCriteria; // This comes from includes/js/filterCriteria.js
            // var params = [2, 5, 7, 10]; // Determins the criterias to use
            var colors = {
                pattern: []
            }

            rowsData.push(['x', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01', '2014-01-01', '2015-01-01']);
            for(var i = 0; i < params.length; ++i) {
                rowsData.push([null, null, null, null, null, null, null, null]); // reset year arrays
            }

            for(var i = 0; i < params.length; ++i) {

                var paramCriteria = criteria[params[i]];
                rowsData[i+1][0] = paramCriteria.name;
                for(var j = 0; j < school.claims.length; ++j) {
                    var total = 0;
                    for(var k = 0; k < paramCriteria.claims.length; ++k) {
                        total += school.claims[j].percent[k];
                    }
                    total /= paramCriteria.claims.length;
                    rowsData[i+1][school.claims[j].year - 2009 + 1] = Math.round(total);
                }
                colors.pattern.push('#f49292');

            }

            c3.generate({
                bindto: "#c3chart",
                data: {
                    x: "x",
                    columns: rowsData,
                    type: "area",
                    empty: {
                        label: {
                            text: "No Data"
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

        }

        function generateGraph2() {
            var chart = c3.generate({
                bindto: '#c3chart',
                data: {
                    rows: [
                        ['Student Satisfaction', 'Teacher Satisfaction'],
                        [61, 56],
                        [null, 88],
                        [59, 56],
                        [39, 44] //claims average

                    ],
                    type: 'area',
                    colors: {
                        'Student Satisfaction': '#f49292',
                        'Teacher Satisfaction': 'green'
                    },
                    empty: {
                        label: {
                            text: "No Data"
                        }
                    }
                },
                line: {
                    connectNull: true
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: ['2009', '2010', '2011', '2012', '2013', '2014'],
                        tick: {
                            culling: {
                                max: 100
                            }
                        },
                        padding: {left:0, right:0}
                    },
                    y: {
                        max: 100,
                        min: 0,
                        padding: {top:0, bottom:0}
                    }

                }

            });
        }

        $scope.calimsGraph = function calimsGraph(category, school) {
            //var retVal = [];
            //var max = 0;
            //var min = 12301201230123;
            //
            //for (var j=0 ; j < school.claims.length ; j++) {
            //    var curSchoolClaim = school.claims[j];
            //    console.log ("Year: " + curSchoolClaim.year);
            //    for(var i = 0; i < criteria[category].claims.length; i++) {
            //        var curClaim = criteria[category].claims[i];
            //
            //        console.log("Claim num:" + curClaim +" " +curSchoolClaim.percent[curClaim]);
            //
            //    }
            //}

            console.log(criteria[category].name);
        }

}]);

