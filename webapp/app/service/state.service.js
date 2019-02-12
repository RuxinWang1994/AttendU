(function () {
    'use strict';

    angular
        .module('attendU')
        .factory('StateService', StateService);

    StateService.$inject = ['$rootScope'];
    function StateService($rootScope) {
        var service = {server:{},
                index:{},
                dashboard:{},
                user:{},
                room:{},
                activity:{},
                data:{},
                info:"test info"
            };

        service.server = {backend:"localhost", userPort:"8004",roomPort:"8002",activityPort:"8003",checkinPort:"8001"};

        service.PackRequest = PackRequest;

        return service;

        function PackRequest(msg) {
            if(service.user.CurrentToken!=null)
                msg = {msg, token:service.user.CurrentToken};
            return msg;
        }
    }

})();