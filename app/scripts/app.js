'use strict';

var userballotApp = angular.module('userballotApp', ['firebase'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/adminarea.html',
        controller: 'AdminAreaCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
