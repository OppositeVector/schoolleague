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
        $http.get('http://localhost:8080/GetSchool?id='+ $routeParams.schoolId).success(function(data) {
            console.log(data.data);
            $scope.school = data.data;
        });

}]);

