(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$location', 'AuthenticationService', 'Flash'];
    function IndexController($location, AuthenticationService, Flash) {
        var vm = this;

        

        (function initController() {
            var hasCookies = AuthenticationService.HasCredentials();

            if(hasCookies){
                $location.path('/home/dashboard');
            }
        })();


    }

})();