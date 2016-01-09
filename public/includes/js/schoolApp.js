/**
 * Created by Peleg on 18/12/2015.
 */
var schoolApp = angular.module("schoolApp", [
    'ngRoute',
    'schoolsControllers',
    'ngMessages',
    'angucomplete',
    'ngAutocomplete'
]).controller('autoCompleteSearch', autoCompleteSearch);

schoolApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'home.html',
            controller: 'searchCtrl'
        }).
        when('/filter/:name', {
            templateUrl: 'filterSchools.html',
            controller: 'filterSchoolsCtrl'
        }).
        when('/getSchool/:schoolId', {
            templateUrl: 'schoolInfo.html',
            controller: 'schoolInfoCtrl'
        }).
        otherwise({
            redirectTo: '/'
    });
}]);

function autoCompleteSearch ($scope, $timeout) {
    //TODO complete
    $scope.result2 = '';
    $scope.options2 = {
        country: 'il'
    };
    $scope.details2 = '';
}
