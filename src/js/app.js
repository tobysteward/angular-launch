(function () {
    'use strict';

    function locationConfig($locationProvider) {
        $locationProvider.html5Mode(true);
    }

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/test1.html',
                controllerAs: 'vm',
                controller: 'TestController',
            })
            .when('/test2', {
                templateUrl: '/views/test2.html',
                controllerAs: 'vm',
                controller: 'TestController',
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    angular
        .module('app', [
            'ngRoute'
        ])
        .config(locationConfig)
        .config(routeConfig);
})();
