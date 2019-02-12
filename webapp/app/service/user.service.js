(function () {
    'use strict';

    angular
        .module('attendU')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$timeout', '$q', 'StateService'];
    function UserService($http, $timeout, $q, StateService) {
		var backend = StateService.server.backend;
		var userPort = StateService.server.userPort;
		
        var service = {};

        service.GetName = GetName;
        service.GetByUsername = GetByUsername;
        service.Update = Update;
        service.Delete = Delete;

		service.Registration = Registration;
        service.Login = Login;
        service.ValidLogin = ValidLogin;
        service.GetUserByUid = GetUserByUid;
		
        return service;

		function Registration(info) {
			return $http.post('http://'+backend+':'+userPort+'/user/registration', info).then(handleReponse);		
		}

        function Login(info) {
            return $http.post('http://'+backend+':'+userPort+'/user/login', info).then(handleReponse);        
        }

        function ValidLogin(uid, token) {
            var info = {uid:uid, token:token};
            return $http.post('http://'+backend+':'+userPort+'/user/validToken', info).then(handleReponse, function(){
                var res = {data:false, status: 200};
                return res;
            });
        }

        function GetByUsername(username) {
            return $http.get('http://'+backend+':'+userPort+'/user/username/' + username).then(handleReponse);
        }
		
        function GetUserByUid(uid) {
            var param = StateService.PackRequest(uid);
            return $http.get('http://'+backend+':'+userPort+'/user/id/' + uid, {params: param}).then(handleReponse);
        }

        function GetName(list) {
            return $http.get('http://'+backend+':'+userPort+'/user/getName/' + list).then(handleReponse);
        }

        
        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleReponse);
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleReponse);
        }

        // private functions

        function handleReponse(res) {
            return res;
        }
    }  

})();
