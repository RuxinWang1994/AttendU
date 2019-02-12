(function () {
    'use strict';

    angular
        .module('attendU')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', 'StateService'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService, StateService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.HasCredentials = HasCredentials;
        service.ValidCredentials = ValidCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, deferred) {
            var credential = { username: username, password: password };
            UserService.Login(credential)
               .then(function (response) {
                   deferred.resolve(response);
               });

        }

        function SetCredentials(uid, token) {

            $rootScope.globals = {
                currentUser: {
                    uid: uid,
                    token: token
                }
            };

            // set default auth header for http requests
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + ;

            // store user details in globals cookie that keeps user logged in for 1 day (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });

            StateService.user.CurrentUid = uid;
            StateService.user.CurrentToken = token;
                    
        }

        function HasCredentials() {
            $rootScope.globals = $cookies.getObject('globals');
            if ($rootScope.globals === undefined || $rootScope.globals == null) {
                return false;
            }
            else{
                if($rootScope.globals.hasOwnProperty('currentUser'))
                    return true;
                else
                    return false;
            }
        }

        function ValidCredentials(deferred) {
            $rootScope.globals = $cookies.getObject('globals');
            if ($rootScope.globals === undefined || $rootScope.globals == null) {
                deferred.resolve(false);
            }
            else{
                var user = $rootScope.globals.currentUser;
                UserService.ValidLogin(user.uid, user.token)
                    .then(function (response) {
                        if(response.status == 200 && response.data==true){
                            StateService.user.CurrentUid = user.uid;
                            StateService.user.CurrentToken = user.token;
                            deferred.resolve(true);
                        }
                        else{
                            ClearCredentials();
                            deferred.resolve(false);
                        }
                    });
            }
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            //$http.defaults.headers.common.Authorization = 'Basic';
            StateService.user.CurrentUid = null;
            StateService.user.CurrentToken = null;
            
        }
    }

})();