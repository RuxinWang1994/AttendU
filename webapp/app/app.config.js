'use strict';

angular.
  module('attendU').
  config(['$locationProvider' ,'$stateProvider','$urlRouterProvider',
    function config($locationProvider, $stateProvider, $urlRouterProvider) {
      //$locationProvider.hashPrefix('!');
      $urlRouterProvider.when('', '/index');
      $urlRouterProvider.when('/', '/index');

      $stateProvider.state('index',{
        url: '/index',
        controller: 'IndexController',
        controllerAs: 'vm',
        templateUrl: 'dashboard/index.html'
      }).
      state('login',{
        controller: 'LoginController',
        controllerAs: 'vm',
        url: '/login',
        templateUrl: 'login/login.view.html'
      }).
      state('register',{
        controller: 'RegisterController',
        controllerAs: 'vm',
        url: '/register',
        templateUrl: 'login/register.view.html'
      }).
      state('home',{
        url: '/home',
        controller: 'HomeController',
        controllerAs: 'vm',
        templateUrl: 'dashboard/home.html'
      }).
      state('home.dash',{
        controller: 'DashboardController',
        controllerAs: 'vm',
        url: '/dashboard',
        templateUrl: 'dashboard/dashboard.view.html'
      }).
      state('home.room',{
        controller: 'RoomListController',
        controllerAs: 'vm',
        url: '/room',
        templateUrl: 'room/roomList.view.html'
      }).
      state('home.createRoom',{
        url: '/room/createRoom',
        controller: 'RoomListController',
        controllerAs: 'vm',
        templateUrl: 'room/createroom.view.html'
      }).

      state('home.configRoom',{
      	controller: 'RoomListController',  
      	controllerAs: 'vm',  
        url: '/room/configRoom',
        templateUrl: 'room/configRoom.view.html'
      }).
      state('home.activity',{
        url: '/activity?enterRID&enterAID',
        controller: 'ActivityController',
        controllerAs: 'vm',
        templateUrl: 'activity/activity.view.html'
      }).
      state('home.activitysetting',{
          url: '/activity/setting?enterRID',
          controller: 'ActivityController',
          controllerAs: 'vm',
          templateUrl: 'activity/activitysetting.view.html'
        }).
      state('home.createActivity',{
        url: '/activity/create?enterRID&enterAID',
        controller: 'ActivityController',
        controllerAs: 'vm',
        templateUrl: 'activity/createactivity.view.html'
      }).
      state('home.configActivity',{
        url: '/activity/config?enterRID&enterAID',
        controller: 'ActivityController',
        controllerAs: 'vm',
        templateUrl: 'activity/configActivity.view.html'
      }).
      state('home.withRID', {
        url: '/home/room/withId/:rid'
      }).
      state('home.dataActivity',{
        url: '/data/activity?enterRID',
        controller: 'DataController',
        controllerAs: 'vm',
        templateUrl: 'data/activity.view.html'
      }).
      state('home.dataActivitySelect',{
        url: '/data/selectActivity?enterAID',
        controller: 'DataController',
        controllerAs: 'vm',
        templateUrl: 'data/selectActivity.view.html'
      }).
      state('home.dataRoom', {
        url: '/home/data',
        controller: 'DataController',
        controllerAs: 'vm',
         templateUrl: 'data/room.view.html'
      })
    
    }
  ]);