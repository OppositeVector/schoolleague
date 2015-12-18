/**
 * Created by Peleg on 18/12/2015.
 */
var schoolApp = angular.module("schoolApp", [
    'ngRoute',
    'schoolsControllers',
    'autocomplete'
]);

schoolApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'home.html',
            controller: 'searchCtrl'
        }).
        //when('/getMaxPrice/:priceInp', {
        //    templateUrl: 'BookList.html',
        //    controller: 'maxPriceCtrl'
        //}).
        //when('/getMix/:authorInp/:yearInp', {
        //    templateUrl: 'BookList.html',
        //    controller: 'mixCtrl'
        //}).
        otherwise({
            redirectTo: '/'
        });
    }]);
