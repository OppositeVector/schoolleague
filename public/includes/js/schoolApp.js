/**
 * Created by Peleg on 18/12/2015.
 */
var schoolApp = angular.module("schoolApp", [
    'ngRoute',
    'schoolsControllers',
    'ngMessages',
    'ngAutocomplete',
    'ui.bootstrap',
    'angucomplete'
]).controller('autoCompleteSearch', autoCompleteSearch);

schoolApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'home.html',
            controller: 'searchCtrl'
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
}
