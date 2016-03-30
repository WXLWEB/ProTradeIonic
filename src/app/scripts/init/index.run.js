(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .run(runBlock);

  /** @ngInject */
  function runBlock($ionicPlatform, $log) {
    $ionicPlatform.ready(function() {
      // save to use plugins here
    });

    // add possible global event handlers here

    $log.debug('runBlock end');
  }

})();
