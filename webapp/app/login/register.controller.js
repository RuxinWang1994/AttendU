(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;
        vm.availableUsername = false;
        vm.checkNewUsername = checkNewUsername;
        vm.register = register;
        vm.user = {};

        function register() {
            vm.dataLoading = true;
			
            UserService.Registration(vm.user)
                .then(function (response) {
                    if (response.status == 200 && response.data == true) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                        vm.user = {};
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function checkNewUsername() {
            UserService.GetByUsername(vm.user.username)
                .then(function (response) {
                    if(response.status == 200 && response.data == true) {
                        vm.availableUsername = false;
                    } else {
                        vm.availableUsername = true;
                    }
                });
        }
    }

})();
