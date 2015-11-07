(function() {
  'use strict';

  angular
    .module('cimMockup')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
