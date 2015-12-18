/**
 * Created by Peleg on 18/12/2015.
 */
var schoolApp = angular.module("schoolApp", [
    'ngRoute',
    'schoolsControllers'
]);

schoolApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'home.html',
            controller: 'homeCtrl'
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
