(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .run(runBlock);

  /** @ngInject */
  function runBlock($ionicPlatform, $log, $rootScope) {
    $ionicPlatform.ready(function() {
      // save to use plugins here
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState) {
      $rootScope.urlParameter = toState.data;
      $log.debug('urlParameter',$rootScope.urlParameter);

    });
    // add possible global event handlers here

    $log.debug('runBlock end');
  }

})();
