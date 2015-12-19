/**
 * Created by Peleg on 18/12/2015.
 */
var schoolApp = angular.module("schoolApp", [
    'ngRoute',
    'schoolsControllers',
    'ngMaterial',
    'ngMessages'
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

function autoCompleteSearch ($timeout, $q, $scope, $location) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.selectedItem;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
        if (query) query = query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

        var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
            deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        //console.log('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        if(item) {
            self.selectedItem = item;
        }
        console.log('Item changed to ' + JSON.stringify(self.selectedItem));
        console.log (self.selectedItem._id)
        $location.url('/getSchool/' + self.selectedItem._id);
    }


    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
        var repos = $scope.schools;
        self.selectedItem = repos[0];
        return repos.map( function (repo) {
            repo.value = repo.name +" "+ repo.city;
            return repo;
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) >= 0);
        };

    }
}
