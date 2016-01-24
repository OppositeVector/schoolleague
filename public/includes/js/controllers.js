/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.flag=false;

        $http.get('http://localhost:8080/GetSchools').success(function(data) {
            $scope.schools = data.data;
            $scope.flag=false

            console.log($scope.schools[0]);
        });

    initMap();
}]);

schoolsControllers.controller('filterSchoolsCtrl', ['$scope', '$http', '$routeParams', '$window',
    function ($scope, $http,  $routeParams, $window) {
        globalSchoolsArray = [];
        $scope.transType="DRIVING";
        $scope.timeVal=15;
        $http.get('http://localhost:8080/GetCity?name=' + $routeParams.name).success(function(data) {
            $scope.schools = data.data;
            globalSchoolsArray = angular.copy($scope.schools);

            //Getting user's address
            $scope.theAddress = JSON.parse($window.sessionStorage.getItem("theAddress"));
            $scope.tempAddress = $scope.theAddress.formatted_address.split(",");

            //Shows markers on map
            filterMap(globalSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);

            //Gets duration per school
            globalSchoolsArray = filterRoutes($scope.theAddress.geometry.location, globalSchoolsArray, $scope.transType);

            //Filters by supervision
            $scope.supervisionIncludes = [];

            $scope.includeSupervision = function(supervision) {
                var i = $.inArray(supervision, $scope.supervisionIncludes);
                if (i > -1) {
                    $scope.supervisionIncludes.splice(i, 1);
                } else {
                    $scope.supervisionIncludes.push(supervision);
                }
                console.log($scope.supervisionIncludes);
                //console.log('1st Schools final grade is: ' + $scope.localSchoolsScoresFinal[0]);
                $scope.getByDuration();
            }

            //Filter by mode of travel
            $scope.changeTravelType = function(){
                console.log($scope.transType);
                globalSchoolsArray = filterRoutes($scope.theAddress.geometry.location, globalSchoolsArray, $scope.transType);
                $scope.getByDuration();
            }

            //Filter by time of travel
            $scope.getByDuration = function() {
                console.log($scope.timeVal);
                var localSchoolsArray = [];
                for (var k = 0; k < globalSchoolsArray.length; k++) {
                    // If exist - temporary check (until we manage to get more than 10 time values back)
                    if (globalSchoolsArray[k].duration) {
                        // Checks if the duration is less or equals the timeVal AND whether it applies to current filters (supervision)
                        if ($scope.supervisionIncludes[0] != null) {
                            for (var j = 0; j < 3; j++) {
                                if ($scope.supervisionIncludes[j] == null) continue;
                                if ((globalSchoolsArray[k].duration / 60 <= $scope.timeVal) && (globalSchoolsArray[k].supervision == $scope.supervisionIncludes[j])) localSchoolsArray.push(globalSchoolsArray[k]);
                            }
                        }
                        // Filters only by duration (supervision is unchecked)
                        else if (globalSchoolsArray[k].duration / 60 <= $scope.timeVal) localSchoolsArray.push(globalSchoolsArray[k]);
                    }
                }

                // Checked whether filter by grade is initiated
                if ($scope.localSchoolsScoresFinal != null){
                        // Creates a Calculated-Grade for each of the relevant schools
                        // Plus - a local grades array while at it . . .
                            var localGradesArr = [];
                        localSchoolsArray.forEach(function (entry, i) {
                            entry.calculatedGrade = $scope.localSchoolsScoresFinal[i];
                            localGradesArr.push($scope.localSchoolsScoresFinal[i]);
                        });

                        // Sorting the local grades array
                        function sortFloat(a, b) {
                            return b - a;
                        }

                        localGradesArr.sort(sortFloat);
                        console.log(localGradesArr.length);

                        // Creating a new sorted schools array
                        var gradeSortedLocalSchoolsArray = [];
                        for (var g = 0; g < 5; g++) {
                            for (var k = 0; k < localSchoolsArray.length; k++) {
                                if ((localGradesArr[g] == localSchoolsArray[k].calculatedGrade) && (gradeSortedLocalSchoolsArray.length < 5)) gradeSortedLocalSchoolsArray.push(localSchoolsArray[k]);
                            }
                        }
                        //console.log(gradeSortedLocalSchoolsArray);
                        filterMap(gradeSortedLocalSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
                    }
                else filterMap(localSchoolsArray, $scope.theAddress.geometry.location, $scope.tempAddress[0]);
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
                    //console.log([evt.item, evt.from]);
                    if (sortable.toArray().length >= 5) {
                        sortable.options.group.put = false;
                    }
                    else {
                        sortable.options.group.put = ['poolList'];
                    }
                    //console.log(sortable.toArray().length);
                    //console.log(sortable.toArray()[0]);
                    //$scope.labelFilter(sortable.toArray());
                },
                onUpdate: function (evt){
                    //console.log('onUpdate.pList:', [evt.item, evt.from]);
                },
                onRemove: function (evt){
                    //console.log('onRemove.pList:', [evt.item, evt.from]);
                    if (sortable.toArray().length >= 5) {
                        sortable.options.group.put = false;
                    }
                    else {
                        sortable.options.group.put = ['poolList'];
                    }
                },
                onStart:function(evt) {
                    //console.log('onStart.pList:', [evt.item, evt.from]);
                },
                onSort:function(evt){
                    //console.log('onStart.pList:', [evt.item, evt.from]);
                    //console.log(sortable.toArray()[0]);
                    $scope.labelFilter(sortable.toArray());
                },
                onEnd: function(evt) {
                    //console.log('onEnd.pList:', [evt.item, evt.from]);
                }
            });


            Sortable.create(poolList, {
                group: {
                    name: "poolList",
                    put: ['labelsList']
                },
                animation: 150,
                //onAdd: function (evt){ console.log('onAdd.labels:', evt.item); },
                //onUpdate: function (evt){ console.log('onUpdate.labels:', evt.item); },
                //onRemove: function (evt){ console.log('onRemove.labels:', evt.item); },
                //onStart:function(evt){ console.log('onStart.labels:', evt.item);},
                //onEnd: function(evt){ console.log('onEnd.labels:', evt.item);}
            });

            // Drag&Drop weights
            var weights = [
                [ 100 ],
                [ 60, 40 ],
                [ 50, 30, 20 ],
                [ 45, 25, 20, 10 ],
                [ 40, 20, 17.5, 12.5, 10 ]
            ]

            // Claims are offset by -1 because the first claim stands on index 0, but its name is claim1
            $scope.criteria = [
                {
                    name: "Teachers Satisfaction",
                    id: "tSat",
                    claims: [ 0, 5, 13, 36, 48, 68 ]
                },
                {
                    name: "Student Satisfaction",
                    id: "sSat",
                    claims: [ 44, 45, 58, 63 ]
                },
                {
                    name: "Student Safety",
                    id: "sSft",
                    claims: [ 3, 11, 17, 24, 33, 34, 43, 46, 47, 52, 53, 60, 62, 70, 76 ]
                },
                {
                    name: "Class Management",
                    id: "clMng",
                    claims: [ 18, 57, 78 ]
                },
                {
                    name: "School Attitude on Violence",
                    id: "schAttVio",
                    claims: [ 1, 12, 71, 72, 77 ]
                },
                {
                    name: "Teacher Personal Treatment",
                    id: "tPrsTrt",
                    claims: [ 8, 16, 22, 25, 26, 27, 31, 39, 49, 54, 66, 80 ]
                },
                {
                    name: "Teacher Learning Treatment",
                    id: "tLrnTrt",
                    claims: [ 2, 9, 10, 15, 19, 32, 35, 37, 38, 41, 55, 56, 61, 65, 67, 74, 75 ]
                },
                {
                    name: "Student Attitude Towards School",
                    id: "sAttSch",
                    claims: [ 29, 42, 79 ]
                },
                {
                    name: "Social Attitude and Activities",
                    id: "soAttAct",
                    claims: [ 4, 14, 20, 28, 30, 40, 50, 51, 64, 69 ]
                },
                {
                    name: "Differential Learning",
                    id: "difLrn",
                    claims: [ 6, 7, 21, 23, 59, 73 ]
                }
            ]

           //Filters by labels
           $scope.labelFilter = function(labels){
               //console.log(sortable.toArray());
               //console.log($scope.criteria.length);

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

               localSchoolsScoresPerLabel = [];
               $scope.localSchoolsScoresFinal = [];
                for (var s = 0 ; s < globalSchoolsArray.length ; s++) {
                    var tempClaimSumArr = [];
                    var tempCriteria = 0;
                    for (l = 0 ; l < localCriteria.length ; l++) {
                        var tempClaimSum = 0;
                        var lastYear = globalSchoolsArray[s].claims.length - 1;
                        for (c = 0 ; c < localCriteria[l].claims.length ; c++) {
                            //console.log('claim ' + l + ' has those grades: ' + localCriteria[l].claims[c]);
                            tempClaimSum += globalSchoolsArray[s].claims[lastYear].percent[localCriteria[l].claims[c]];
                        }
                        //tempAverage += (tempClaimSum / localCriteria[l].claims.length);
                        //console.log(tempClaimSum);
                        tempClaimSumArr.push(tempClaimSum / localCriteria[l].claims.length);

                    }
                    localSchoolsScoresPerLabel.push(tempClaimSumArr);
                    //console.log('School ' + s + ' has those grades: ' + localSchoolsScoresPerLabel[s]);
                    for (var w = 0 ; w < localWeights.length ; w++) {
                        //console.log('S = ' + s + ": ");
                        //console.log(tempClaimSumArr[w]);
                        //console.log(tempClaimSumArr[w] * localWeights[w]);
                        tempCriteria += (tempClaimSumArr[w] * localWeights[w]);
                        //console.log(tempCriteria);
                    }
                    $scope.localSchoolsScoresFinal.push(tempCriteria);
                    //console.log('School ' + s + 's final grade is: ' + localSchoolsScoresFinal[s]);
                }
               $scope.getByDuration();
            }

        });
    }]);

schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('http://localhost:8080/GetSchool?id='+ $routeParams.schoolId).success(function(data) {
            console.log(data.data);
            $scope.school = data.data;
        });

}]);

