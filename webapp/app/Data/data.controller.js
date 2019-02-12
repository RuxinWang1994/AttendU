(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('DataController', DataController);
    DataController.$inject = ['UserService','ActivityService','$rootScope', '$location','$q','RoomService', 'FlashService', '$scope', 'StateService'];
    function DataController(UserService, ActivityService, $rootScope, $location, $q, RoomService, FlashService, $scope, StateService) {
        var vm = this;
        vm.user = {};
        vm.selectedRoom = StateService.data.selectedRoom;
        vm.selectedActivity = StateService.data.selectedActivity;
        vm.admittedRooms = {};
        vm.activity = {};
        vm.showTable = true;

        vm.datalist = {raw:[], checked:[], absent:[], noact:[]};


        vm.pie = [0,0,0];
        vm.pieEnable = false;
        vm.pieLabels = ["Checked in", "Absence", "No Action"];

        // functions
        vm.roomChosen = roomChosen;
        vm.getAdminList = getAdminList;

        (function init(){//asynchronous
            var initdef = $q.defer();
            var initpromise = initdef.promise;
            if(StateService.user.CurrentUid == undefined||StateService.user.CurrentUid == null)
                StateService.data.initdef = initdef;
            else{
                initdef.resolve();
            }

            initpromise.then(function(){
                vm.user = StateService.user;
                getAdminList();
            });
        })();
        

        function roomChosen(selectedRoom){
            StateService.data.selectedRoom = selectedRoom;
            $location.url("/home/data/activity?enterRID="+selectedRoom.rid);
        }

        function getAdminList(){
            RoomService.getRoomByAdmin(vm.user.CurrentUid)
                .then(function(response){
                    if(response.status == 200 && response.data != null && response.data.length > 0) {
                        vm.admittedRooms = response.data;
                        StateService.data.admittedList = vm.admittedRooms;
                    }
                });
        }

        vm.getActivityList = function getActivityList() {
            ActivityService.getActivityByRoom(StateService.data.selectedRoom.rid)
            .then(function(response){
                if (response.status == 200 && response.data != null && response.data.length > 0){
                    vm.activity = response.data;
                    StateService.data.ActivityList = vm.activity;                    
                }
                else{
                    //FlashService.Error("Cannot find any activity for this room");
                }
            });
        }

        vm.activityChosen = function activityChosen(selectedActivity){
            StateService.data.selectedActivity = selectedActivity;
            $location.url("/home/data/selectActivity?enterAID="+selectedActivity.aid);
        }

        vm.goTable = function goTable(){
            vm.showTable = true;
            vm.pieEnable = false;
            StateService.data.selectedRoom = vm.selectedRoom;
            StateService.data.selectedActivity = vm.selectedActivity;
            vm.getData();
            //$location.url("/home/data/selectedActivity?enterAID="+vm.selectedActivity.aid);
        }

        vm.goChart = function goChart(){
            vm.showTable = false;
            vm.pieEnable=true;
            vm.pie = [vm.datalist.checked.length,vm.datalist.absent.length,
                vm.datalist.noact.length];
            StateService.data.selectedRoom = vm.selectedRoom;
            StateService.data.selectedActivity = vm.selectedActivity;
            vm.getData();
            //$location.url("/home/data/selectedActivity?enterAID="+vm.selectedActivity.aid);
        }
        
        vm.getData = function getData(){
            ActivityService.getActivityParticipation(vm.selectedActivity.aid)
                .then(function(response){
                    if(response.status==200 && response.data != null){
                        vm.datalist = {raw:[], checked:[], absent:[], noact:[]};
                        vm.datalist.raw = response.data
                        collectName();
                    }
                });
        } 


        //------------------------ internal use --------------------

        function collectName(){
            var uids = [];
            for(var i=0;i<vm.datalist.raw.length;i++){
                uids.push(vm.datalist.raw[i].uid);
            }
            UserService.GetName(uids)
                .then(function(response){
                    if(response.status == 200 && response.data!=null){
                        for(var i=0; i<response.data.length;i++){
                            for(var j=0; j<vm.datalist.raw.length;j++){
                                if(!vm.datalist.raw[j].firstname==null)
                                    continue;
                                if(vm.datalist.raw[j].uid == response.data[i].uid){
                                    vm.datalist.raw[j].firstname = response.data[i].firstName;
                                    vm.datalist.raw[j].lastname = response.data[i].lastName;
                                }
    
                            }
                        }

                        category();
                    }

                });
        }

        function category(){
            for(var i=0; i<vm.datalist.raw.length;i++){
                var cur = vm.datalist.raw[i];
                cur = {attendance:cur.attendance, firstname:cur.firstname, lastname:cur.lastname, createTime:cur.createTime};
                if(cur.attendance == 0)
                    vm.datalist.noact.push(cur);
                else if (cur.attendance == 1) 
                    vm.datalist.checked.push(cur);
                else
                    vm.datalist.absent.push(cur);
            }
        }
    }
})();