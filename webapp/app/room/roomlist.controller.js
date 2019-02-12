(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('RoomListController', RoomListController);
    RoomListController.$inject = ['$rootScope', '$location','$q','RoomService', 'AuthenticationService', 'FlashService', '$scope', 'StateService'];
    function RoomListController($rootScope, $location, $q, RoomService, AuthenticationService, FlashService, $scope, StateService) {
        var deffered = $q.defer();
        var promise = deffered.promise;
        var vm = this;
        vm.user = {};
        vm.rooms = {};
        vm.admittedRooms = {};
        vm.newRoom = {};
        vm.editRoom = {};
        vm.showManageList = false;
        vm.createLoading=false;

        // functions
        vm.goRooms = goRooms;
        vm.goAdmittedRooms = goAdmittedRooms;
        vm.getRooms = getRooms;
        vm.roomChosen = roomChosen;
        vm.register = register;
        vm.goCreate = goCreate;
        vm.getAdminList = getAdminList;
        vm.congfigRoom = congfigRoom;
        vm.goConfig = goConfig;
        vm.showConfig = showConfig;
        vm.quitRoom = quitRoom;
        vm.removeRoom = removeRoom;

        (function init(){//asynchronous
            vm.newRoom = null;
            vm.editRoom = null;
            vm.createLoading = false;
            var initdef = $q.defer();
            var initpromise = initdef.promise;
            if(StateService.user.CurrentUid == undefined||StateService.user.CurrentUid == null)
                StateService.room.initdef = initdef;
            else{
                initdef.resolve();
            }

            initpromise.then(function(){
                vm.user = StateService.user;
                getRooms();
                getAdminList();
            });
        })();
        

        function register() {
            vm.createLoading = true;
            
            RoomService.Registration(vm.newRoom, vm.user.CurrentUid)
                .then(function (response) {
                    if (response.status == 200 && response.data == true) {
                        $location.path('/home/room');
                    } else {
                        vm.createLoading = false;
                    }
                });
        }

        function roomChosen(selectedRoom){
            StateService.room.selectedRoom = selectedRoom;
            $location.url("/home/activity?enterRID="+selectedRoom.rid);
        }
        
        function goRooms(){
            vm.showManageList = false;
            getRooms();
        }

        function getRooms(){
            RoomService.getRoomByUid(StateService.user.CurrentUid)
            .then(function (response){
                deffered.resolve(response);
        });
        	
        }

        function goCreate(){
            vm.newRoom = {};
            $location.path("/home/room/createRoom");
        }

        function goAdmittedRooms(){
            vm.showManageList = true;
            getAdminList();
        }

        function getAdminList(){
            RoomService.getRoomByAdmin(vm.user.CurrentUid)
                .then(function(response){
                    if(response.status == 200 && response.data != null && response.data.length > 0) {
                        vm.admittedRooms = response.data;
                        StateService.room.admittedList = vm.admittedRooms;
                        if(vm.rooms.length<vm.admittedRooms.length)
                            getRooms();
                        else{
                            attachAdmin();
                            StateService.room.RoomList = vm.rooms;
                        }
                    }
                    else{

                    }
                });
        }

        function congfigRoom() {
            vm.dataLoading = true;

            var deferred = $q.defer();
            var promise = deferred.promise;
            var uid = StateService.user.CurrentUid;
            
            //CurrentRid is a temporary name
            var rid = StateService.room.CurrentRid;
            RoomService.UpdateRoomInfo(vm.editRoom.rid, vm.editRoom.name, vm.editRoom.participationNum, vm.editRoom.description)
                .then(function(response){
                    deferred.resolve(response);
                });

            promise.then(function (response) {
                if (response.status == 200 && response.data==true) {
                    $location.path('/home/room');
                } else {
                    vm.dataLoading = false;
                }
            });
        }

        function showConfig() {
            if(StateService.room.selectedRoom == undefined || StateService.room.selectedRoom == null)
                $location.path("/home/room");
            else{
                if(!StateService.room.selectedRoom.hasOwnProperty("rid"))
                    $location.path("/home/room");
                vm.editRoom = StateService.room.selectedRoom;
                StateService.room.selectedRoom = null;
            }
            
        }

        function goConfig(selectedRoom){
            vm.editRoom = {};
            StateService.room.selectedRoom = selectedRoom;
            $location.path("/home/room/configRoom")
        }

        function quitRoom(selectedRoom){
            RoomService.quitRoom(vm.user.CurrentUid, selectedRoom.rid)
                .then(function(response){
                    if(response.data == true && response.status == 200)
                        refreshList();
                    else
                        FlashService.Error("Quit "+selectedRoom.name+" failed");
                });
        }

        function removeRoom(selectedRoom){
            RoomService.removeRoom(vm.user.CurrentUid, selectedRoom.rid, $rootScope.globals.currentUser.token)
                .then(function(response){
                    if(response.data == true && response.status == 200)
                        refreshList();
                    else
                        FlashService.Error("Remove"+selectedRoom.name+"failed");
                });
        }

        promise.then(function(response){
            if(response.status == 200 && response.data != null && response.data.length > 0) {
                //FlashService.Success("Rooms found", true);
                vm.rooms = response.data;
                if(vm.admittedRooms.length > 0)
                    attachAdmin();
                StateService.room.RoomList = vm.rooms;
            }
            else{
                FlashService.Error("Cannot find any room");
            }
        });


        //------------------------ internal use --------------------

        function attachAdmin(){
            for(var i = 0; i<vm.admittedRooms.length;i++){
                for(var j=0; j<vm.rooms.length;j++){
                    if(vm.rooms[j].isAdmin)
                        continue;

                    if(vm.admittedRooms[i].rid == vm.rooms[j].rid){
                        vm.rooms[j].isAdmin = true;
                        break;
                    }
                    else if(vm.rooms[j].isAdmin == undefined || vm.rooms[j].isAdmin == null)
                        vm.rooms[j].isAdmin = false;
                }
            }
        }

        function refreshList(){
            vm.rooms.length = 0;
            getAdminList();
        }
    }
})();