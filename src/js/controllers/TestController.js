(function () {
    'use strict';

    /**
     * @name TestController
     * @desc Test controller
     */
    function TestController($location) {
        console.log($location.$$url);
    }

    angular
        .module('app')
        .controller('TestController', TestController);
})();
