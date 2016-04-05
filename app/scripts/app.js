'use strict';

/**
 * @ngdoc overview
 * @name angularGridApp
 * @description
 * # angularGridApp
 *
 * Main module of the application.
 */
angular
  .module('ngGridApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'firebase',
    'ngMask',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
