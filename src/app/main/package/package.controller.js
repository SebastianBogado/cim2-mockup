(function() {
  'use strict';

  angular
    .module('cimMockup')
    .controller('PackageController', PackageController);

  /** @ngInject */
  function PackageController($scope, $stateParams) {
    var vm = this;

    activate();

    function activate() {
      angular.extend(vm, $scope.main.packages[$stateParams.id]);
    }
  }
})();
