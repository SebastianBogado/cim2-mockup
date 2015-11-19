(function() {
  'use strict';

  angular
    .module('cimMockup')
    .controller('ShelfController', ShelfController);

  /** @ngInject */
  function ShelfController($scope, $stateParams) {
    var vm = this;

    vm.getOccupationPercentage = getOccupationPercentage;

    activate();

    function activate() {
      angular.extend(vm, $scope.main.shelves[$stateParams.id]);
    }

    function getOccupationPercentage() {
      var occupiedCells = vm.colsCount.reduce( function (memo, colCount) {
        return memo + colCount;
      }, 0);
      var totalCells = vm.rows.length * vm.rows[0].cells.length;
      return 100 * (occupiedCells / totalCells);
    }
  }
})();
