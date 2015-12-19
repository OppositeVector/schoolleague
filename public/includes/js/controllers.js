/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.flag=false;

        $http.get('//schoolleague.herokuapp.com/GetSchools').success(function(data) {
            console.log(data.data);
            $scope.schools = data.data;
            $scope.flag=true
        });


}]);

schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http.get('//schoolleague.herokuapp.com/GetSchool?id='+ $routeParams.schoolId).success(function(data) {
            console.log(data.data);
            $scope.school = data.data;
        });

}]);

//
//schoolsControllers.controller('searchCtrl', ['$scope', '$http', '$rootScope','$window',
//    function ($scope, $http, $rootScope, $window) {
//        $rootScope.flag=false;
//
//        $http.get('http://localhost:8080/GetSchools').success(function(data) {
//            console.log(data.data);
//            //$window.sessionStorage.schools = data.data;
//
//            $window.sessionStorage.setItem('schools', angular.toJson(data.data));
//            $scope.schools = $window.sessionStorage.getItem('schools');
//
//            $window.sessionStorage.setItem('flag', true);
//            //$window.sessionStorage.flag = true;
//            $scope.flag = $window.sessionStorage.getItem('flag');
//        });
//
//
//    }]);
//
//schoolsControllers.controller('schoolInfoCtrl', ['$scope', '$http', '$routeParams','$rootScope','$window',
//    function ($scope, $http, $routeParams, $rootScope, $window) {
//        $http.get('http://localhost:8080/GetSchool?id='+ $routeParams.schoolId).success(function(data) {
//            console.log(data.data);
//            $scope.school = data.data;
//            $scope.schools = $window.sessionStorage.getItem('schools');
//            $scope.flag = $window.sessionStorage.getItem('flag');
//        });
//
//
//
//    }]);

