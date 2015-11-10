(function() {
  'use strict';

  angular
    .module('cimMockup')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html',
      })
      .state('main', {
        url: '/',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main.home', {
        url: 'home',
        templateUrl: 'app/main/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('main.shelf', {
        url: 'pasillo/:id',
        templateUrl: 'app/main/shelf/shelf.html',
        controller: 'ShelfController',
        controllerAs: 'shelf'
      })
      .state('main.package', {
        url: 'paquete/:id',
        templateUrl: 'app/main/package/package.html',
        controller: 'PackageController',
        controllerAs: 'package'
      });

    $urlRouterProvider
      .otherwise('/home');
  }

})();
