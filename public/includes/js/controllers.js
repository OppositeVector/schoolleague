/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http', '$timeout', '$q',
    function ($scope, $http, $timeout, $q) {
        $scope.flag=false;

        $http.get('http://localhost:8080/GetSchools').success(function(data) {
            console.log(data.data);
            $scope.schools = data.data;
            $scope.flag=true
        });


}]);

schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('http://localhost:8080/GetSchool?id='+ $routeParams.schoolId).success(function(data) {
            console.log(data.data);
            $scope.school = data.data;
        });

}]);
