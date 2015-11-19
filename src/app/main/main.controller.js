(function() {
  'use strict';

  angular
    .module('cimMockup')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(dataGenerator) {
    var vm = this;

    vm.packages = [];
    vm.robots = [];
    vm.shelves = [];

    vm.stringifyRobotState = stringifyRobotState;

    vm.email = 'someone@mail.com';

    // Demo
    vm.toggleRobotBrokenStatus = dataGenerator.toggleRobotBrokenStatus;

    activate();

    function activate() {
      vm.packages = dataGenerator.getPackages();
      vm.robots = dataGenerator.getRobots();
      vm.shelves = dataGenerator.getShelves();
    }

    function stringifyRobotState(robot) {
      if (robot.broken)   return 'Alerta!';
      if (robot.idle)     return 'Inactivo';
      if (robot.retrieving)  return 'Retirando paquete';
      if (robot.storing)  return 'Depositando paquete';
    }

  }
})();
