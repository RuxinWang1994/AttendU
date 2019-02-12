(function () {
    'use strict';

    angular
        .module('attendU')
        .factory('ActivityService', ActivityService);

    ActivityService.$inject = ['$http', '$timeout', '$q','StateService'];
    function ActivityService($http, $timeout, $q, StateService) {
    	var backend = StateService.server.backend;
        var activityPort = StateService.server.activityPort;
        
        var service = {};

        service.getRoomByAid = getRoomByAid;
        service.getRoomByRid = getRoomByRid;
        service.getActivityByAid = getActivityByAid;
        service.CreateActivity = CreateActivity;
        service.getActivityByRoom = getActivityByRoom;
        service.StartActivity = StartActivity;
        service.isAdmin = isAdmin;
        service.updateActivity = updateActivity;
        service.removeActivity = removeActivity;
        service.getParticipation = getParticipation;
        service.getRecentActivity = getRecentActivity;
        service.getActivityParticipation = getActivityParticipation;
        service.subscribe = subscribe;
        service.unsubscribe = unsubscribe;
       	
        return service;

        function isAdmin(uid, rid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/isAdmin/'+ uid+'/'+rid).then(function(response){
                if(response.data == true && response.status==200)
                    return true;
                return false;
            }, function(){
                return false;
            });
        }

        function getRoomByRid(rid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/getRoom/rid/'+ rid).then(handleReponse, function(){
                return {status: 200, data:null};
            });     
        }

        function getRoomByAid(aid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/getRoom/'+ aid).then(handleReponse, function(){
                return {status: 200, data:null};
            });     
        }

        function getActivityByAid(aid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/getActivity/'+ aid).then(handleReponse, function(){
                return {status: 200, data:null};
            });     
        }

		function CreateActivity(uid, rid, info) {
			return $http.post('http://'+backend+':'+activityPort+'/activity/createActivity/'+ uid +'/'+ rid, info).then(handleReponse, function(){
                return {status: 200, data:false};
            });		
		}
        
        function StartActivity(status, id){
            if (status == true)
                return $http.post('http://'+backend+':'+activityPort+'/activity/startActivity/'+id).then(handleReponse);
            else
                return $http.post('http://'+backend+':'+activityPort+'/activity/endActivity/'+id).then(handleReponse);
        }

        function getActivityByRoom(id){
            return $http.get('http://'+backend+':'+activityPort+'/activity/getActivityList/'+id).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function updateActivity(activity){
            return $http.post('http://'+backend+':'+activityPort+'/activity/updateActivity', activity).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function removeActivity(activity){
             return $http.post('http://'+backend+':'+activityPort+'/activity/removeActivity', activity).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function getParticipation(uid, rid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/getParticipation/'+rid+'/'+uid).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function getRecentActivity(uid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/getRecent/'+uid).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function getActivityParticipation(aid){
            return $http.get('http://'+backend+':'+activityPort+'/activity/participation/'+aid).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function subscribe(info){
            return $http.post('http://'+backend+':'+activityPort+'/activity/updateParticipation', info).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        function unsubscribe(info){
            return $http.post('http://'+backend+':'+activityPort+'/activity/removeParticipation', info).then(handleReponse , function(){
                return {status: 200, data:null};
            });
        }

        // private functions

        function handleReponse(res) {
            return res;
        }
    }  

})();
