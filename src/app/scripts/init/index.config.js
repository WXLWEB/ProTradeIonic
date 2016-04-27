(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, constant) {
    // Enable log
    $logProvider.debugEnabled(constant.debug);

    /**
      * <pre>
      *   $httpProvider.interceptors.push('tokenAppend');
      *   We have pushed a factory function named tokenAppend to the interceptors. That means
      *   before we send a http request, the tokenAppend function will be invoked.Then we can
      *   append json-web-token to http headers.
      * <pre>
    **/
    $httpProvider.interceptors.push('tokenAppend');
  }

})();
