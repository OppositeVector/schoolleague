/**
 * Created by Peleg on 18/12/2015.
 */
var schoolsControllers = angular.module('schoolsControllers', []);

schoolsControllers.controller('searchCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('http://localhost:8080/GetSchools').success(function(data) {
            console.log(data.data);
            $scope.schools = data.data;

            //$scope.updateSchools = function(typed){
            //    // MovieRetriever could be some service returning a promise
            //    $scope.newmovies = MovieRetriever.getmovies(typed);
            //    $scope.newmovies.then(function(data){
            //        $scope.movies = data;
            //    });
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
