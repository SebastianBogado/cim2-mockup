(function() {
  'use strict';

  angular
    .module('cimMockup')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(dataGenerator) {
    var vm = this;

    vm.packages = [];
    vm.robots = [
      {id: 0, pos: 0, idle: true},
      {id: 1, pos: 90, idle: false}
    ];
    vm.shelves = [
      {id: 0, colsCount: [], rows: []},
      {id: 1, colsCount: [], rows: []},
      {id: 2, colsCount: [], rows: []}
    ];

    activate();

    function activate() {
      vm.packages = dataGenerator.getPackages();
      vm.robots = dataGenerator.getRobots();
      vm.shelves = dataGenerator.getShelves();
    }
  }
})();
