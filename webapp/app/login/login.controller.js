(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'Flash', 'StateService','$q'];
    function LoginController($location, AuthenticationService, Flash, StateService,$q) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            //AuthenticationService.ClearCredentials();

            var deferred = $q.defer();
            var promise = deferred.promise;

            AuthenticationService.Login(vm.username, vm.password, deferred);

            promise.then(function (response) {
                if (response.status == 200 && response.data['uid']>0) {
                    AuthenticationService.SetCredentials(response.data['uid'], response.data['token']);
                    $location.path('/');
                    vm.username = {};
                    vm.password = {};
                } else {
                    Flash.create('danger', "Wrong password",10000,{},false);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
