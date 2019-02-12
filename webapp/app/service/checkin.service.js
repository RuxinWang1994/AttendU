(function () {
    'use strict';

    angular
        .module('attendU')
        .factory('CheckinService', CheckinService);

    CheckinService.$inject = ['$http', '$timeout', '$q','StateService'];
    function CheckinService($http, $timeout, $q, StateService) {
        var backend = StateService.server.backend;
        var checkinPort = StateService.server.checkinPort;
        var service = {}

        service.checkin = checkin;
        service.getCheckinInfo = getCheckinInfo;
        service.absent = absent;

        return service;

        function checkin(uid, rid, aid){
            return $http.post('http://'+backend+':'+checkinPort+'/checkin/'+aid+'/'+rid+'/checkin/'+uid).then(handleReponse, function(){
                return {status: 200, data:false};
            });
        }
        
        function getCheckinInfo(uid, rid, aid){
            return $http.get('http://'+backend+':'+checkinPort+'/checkin/getCheckinInfo/'+rid+'/'+aid+'/'+uid).then(function(response){
                if(response.data != null && response.status==200)
                    return true;
                return false;
            }, function(){
                return false;
            });
        }

        function absent(uid,rid, aid, reason){
            return $http.post('http://'+backend+':'+checkinPort+'/checkin/'+rid+'/'+aid+'/absent/'+uid, reason).then(function(response){
                if(response.data != null && response.status==200)
                    return true;
                return false;
            }, function(){
                return false;
            });
        }

        // private functions

        function handleReponse(res) {
            return res;
        }
    }
})();
