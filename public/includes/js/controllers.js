/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('homeCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('http://localhost:8080/GetSchools').success(function(data) {
            console.log(data.data);
            $scope.schools = data;
        });

        //console.log($scope.schools)
        //$scope.orderProp = 'name';
        //
        //$scope.filter = '$';
        //
        //$scope.query = '';
        //
        //$scope.getFilter = function() {
        //    var filter = {};
        //    filter[$scope.filter] = $scope.query;
        //    return filter;
        //};
}]);
