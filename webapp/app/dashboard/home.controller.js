(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope','RoomService','$location', 'AuthenticationService', 'Flash', '$q', 'UserService', 'StateService'];
    function HomeController($scope, RoomService,$location, AuthenticationService, Flash, $q, UserService, StateService) {
        var vm = this;
        vm.userLoaded = false;
        vm.showName = null;
        vm.searchID = null;

        vm.search = function(){
            if(vm.searchID != null && vm.searchID>0){
                RoomService.searchRoom(vm.searchID)
                    .then(function(reponse){
                        if(reponse.status == 200 && reponse.data == true){
                            $location.url("/home/activity?enterRID="+vm.searchID);
                        }
                        else{
                            $mdDialog.show(
                              $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#popupContainer')))
                                .clickOutsideToClose(true)
                                .title('Room ID Not Found')
                                .textContent('The room id you tried to reach is not correct')
                                .ariaLabel('Search room failed')
                                .ok('Dismiss')
                                .targetEvent($scope.ev)
                            );
                        }
                    });
                
            }
        };


        vm.onloadFun = (function initController() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            AuthenticationService.ValidCredentials(deferred);

            promise.then(function(result){
                if(!result){
                    $location.path('/');
                }
                else{
                    UserService.GetUserByUid(StateService.user.CurrentUid).then(
                        function(reponse){
                            if(reponse.status == 200 && reponse.data.uid>0){
                                StateService.user.CurrentUser = reponse.data;
                                vm.userLoaded = true;
                                vm.showName = StateService.user.CurrentUser.firstName;

                                vm.showName = vm.showName + ", logout";

                                if(StateService.dashboard.initdef != undefined ||
                                    StateService.dashboard.initdef != null)
                                    StateService.dashboard.initdef.resolve();
                                if(StateService.room.initdef != undefined ||
                                    StateService.room.initdef != null)
                                    StateService.room.initdef.resolve();
                                if(StateService.activity.initdef != undefined ||
                                    StateService.activity.initdef != null)
                                    StateService.activity.initdef.resolve();
                                if(StateService.data.initdef != undefined ||
                                    StateService.data.initdef != null)
                                    StateService.data.initdef.resolve();
                            }

                        });
                }
            });
           
        });

        vm.test =1;
            
        vm.Logout = function(){
            AuthenticationService.ClearCredentials();
            $location.path('/');
        };

    }

})();