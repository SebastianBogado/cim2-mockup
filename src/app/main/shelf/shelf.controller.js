(function() {
  'use strict';

  angular
    .module('cimMockup')
    .controller('ShelfController', ShelfController);

  /** @ngInject */
  function ShelfController($scope, $stateParams) {
    var vm = this;

    angular.extend(vm, $scope.main.shelves[$stateParams.id]);

    activate();

    function activate() {

    }
  }
})();
