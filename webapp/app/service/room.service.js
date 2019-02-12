(function () {
    'use strict';

    angular
        .module('attendU')
        .factory('RoomService', RoomService);
    
    RoomService.$inject = ['$http', '$timeout', '$q', 'StateService'];
    function RoomService($http, $timeout, $q, StateService) {
		var backend = StateService.server.backend;
		var roomPort = StateService.server.roomPort;
		
        var service = {};

        service.Registration = Registration;
        service.getRoomByAdmin = getRoomByAdmin;
        service.getRoomByUid = getRoomByUid;
        service.UpdateRoomInfo = UpdateRoomInfo;
        service.quitRoom = quitRoom;
        service.removeRoom = removeRoom;
        service.searchRoom = searchRoom;
		
        return service;

		function Registration(info, uid) {
			return $http.post('http://'+backend+':'+roomPort+'/room/createRoom/'+uid, info).then(handleReponse, function(){
                return {status: 200, data:false};
            });		
		}
		
        function getRoomByUid(id){
            return $http.get('http://'+backend+':'+roomPort+'/room/getRooms/'+id).then(handleReponse);
        }

    	function getRoomByAdmin(id){
    		return $http.get('http://'+backend+':'+roomPort+'/room/getRoomByAdmin/'+id).then(handleReponse);
        }
        
		function UpdateRoomInfo(rid, roomname, participationnum,roomdescription) {
			var info = { rid:rid, name:roomname, participationNum:participationnum, description:roomdescription};
			return $http.post('http://'+backend+':'+roomPort+'/room/updateRoom', info).then(handleReponse);		
		}
		

        function quitRoom(uid, rid) {
            var info = { rid:rid, uid: uid};
            return $http.post('http://'+backend+':'+roomPort+'/room/quitRoom', info).then(handleReponse);      
        }

        function removeRoom(uid,rid,token){
            var info = { rid:rid, adminId:uid, name:token};
            return $http.post('http://'+backend+':'+roomPort+'/room/removeRoom', info).then(handleReponse);
        }

        function searchRoom(rid){
            return $http.get('http://'+backend+':'+roomPort+'/room/searchRoom/'+rid).then(handleReponse);
        }

        // private functions

        function handleReponse(res) {
            return res;
        }
    }  

})();
