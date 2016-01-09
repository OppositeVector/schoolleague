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

schoolsControllers.controller('filterSchoolsCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http,  $routeParams) {
        $http.get('http://localhost:8080/GetCity?name=' + $routeParams.name).success(function(data) {
            $scope.schools = data.data;
            filterMap($scope.schools);

            $scope.supervisionIncludes = [];

            $scope.includeSupervision = function(supervision) {
                var i = $.inArray(supervision, $scope.supervisionIncludes);
                if (i > -1) {
                    $scope.supervisionIncludes.splice(i, 1);
                } else {
                    $scope.supervisionIncludes.push(supervision);
                }

                console.log($scope.schools[0].supervision);
                console.log($scope.supervisionIncludes.length);
                console.log($scope.supervisionIncludes[0]);
                console.log($scope.schools.length);

                var newSchoolsArray = [];

                for(k=0 ; k<$scope.schools.length ; k++) {
                    for (j=0 ; j<3 ; j++) {
                        if ($scope.supervisionIncludes[j] == null) continue;
                        if ($scope.schools[k].supervision == $scope.supervisionIncludes[j])
                            newSchoolsArray.push($scope.schools[k]);
                    }
                }
                console.log(newSchoolsArray.length);
                if ($scope.supervisionIncludes[0] == null) filterMap($scope.schools);
                else filterMap(newSchoolsArray);
            }

            //$scope.supervisionIncludes = [];
            //$scope.education
            //
            //$scope.gameChanger = function(education) {
            //
            //}
            //
            //$scope.includeSupervision = function(supervision) {
            //    var i = $.inArray(supervision, $scope.supervisionIncludes);
            //    if (i > -1) {
            //        $scope.supervisionIncludes.splice(i, 1);
            //    } else {
            //        $scope.supervisionIncludes.push(supervision);
            //    }
            //
            //    console.log($scope.schools[0].supervision);
            //    console.log($scope.schools[0].language);
            //    console.log($scope.supervisionIncludes.length);
            //    console.log($scope.supervisionIncludes[0]);
            //    console.log($scope.schools.length);
            //
            //    var newSchoolsArray = [];
            //
            //    for(k=0 ; k<$scope.schools.length ; k++) {
            //        for (j=0 ; j<6 ; j++) {
            //            if ($scope.supervisionIncludes[j] == null) continue;
            //            if ( ($scope.schools[k].supervision == $scope.supervisionIncludes[j]) || ($scope.schools[k].language == $scope.supervisionIncludes[j]) )
            //                newSchoolsArray.push($scope.schools[k]);
            //        }
            //    }
            //    console.log(newSchoolsArray.length);
            //    if ($scope.supervisionIncludes[0] == null) filterMap($scope.schools);
            //    else filterMap(newSchoolsArray);
            //}

            //$scope.languageIncludes = [];
            //
            //$scope.includeLanguage = function(language) {
            //    var i = $.inArray(language, $scope.languageIncludes);
            //    if (i > -1) {
            //        $scope.languageIncludes.splice(i, 1);
            //    } else {
            //        $scope.languageIncludes.push(language);
            //    }
            //
            //    console.log($scope.schools[12].language);
            //    console.log($scope.languageIncludes.length);
            //    console.log($scope.languageIncludes[0]);
            //    console.log($scope.schools.length);
            //
            //    newSchoolsArray = [];
            //
            //    for(k=0 ; k<$scope.schools.length ; k++) {
            //        for (j=0 ; j<3 ; j++) {
            //            if ($scope.languageIncludes[j] == null) continue;
            //            if ($scope.schools[k].language == $scope.languageIncludes[j])
            //                newSchoolsArray.push($scope.schools[k]);
            //        }
            //    }
            //    console.log(newSchoolsArray.length);
            //    if ($scope.languageIncludes[0] == null) filterMap($scope.schools);
            //    else filterMap(newSchoolsArray);
            //}

        });
    }]);

schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('http://localhost:8080/GetSchool?id='+ $routeParams.schoolId).success(function(data) {
            console.log(data.data);
            $scope.school = data.data;
        });

}]);

