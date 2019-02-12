(function () {
    'use strict';

    angular
        .module('attendU')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location', 'Flash', '$q', 'StateService', 'RoomService', 'ActivityService'];
    function DashboardController($location, Flash, $q, StateService, RoomService, ActivityService) {
        var vm = this;
        vm.userLoaded = false;
        vm.showName = null;
        vm.dashboardActivity = {};
        vm.dashboardRoom = {};


        vm.get = get;


        function get(){
            var initdef = $q.defer();
            var initpromise = initdef.promise;
            if(StateService.user.CurrentUid == undefined||StateService.user.CurrentUid == null)
                StateService.dashboard.initdef = initdef;
            else{
                initdef.resolve();
            }

            initpromise.then(function(){
                vm.user = StateService.user;
                ActivityService.getRecentActivity(vm.user.CurrentUid)
                    .then(function(response){
                        if(response.status == 200 && response.data!= null){
                            vm.dashboardActivity = response.data;
                        }
                    });
            });
        }



    }

})();