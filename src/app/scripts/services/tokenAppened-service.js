'use strict';
angular.module('ProTradeIonic')
  .factory('tokenAppend',function(ipCookie, localStorageService, $q, $location, $rootScope, constant) {
    return {
      request: function (config) {
          //Add JWT header to all API requests
          if(config.method === 'POST'){
              if (localStorageService.get("btcchina_jwt")){
                  config.headers['Json-Web-Token'] = localStorageService.get("btcchina_jwt");
              }
          }
          return config;
      },

      requestError: function(rejection) {
          return $q.reject(rejection);
      },

      response: function (response) {
          if (response.status === 401 ) { // the user is not authenticated

          }
          //update JWT for each successful request to expiration time
          if(response.status === 200 && response.headers('Last-Modified')){

              var recToken = response.headers('Last-Modified');
              if(recToken.indexOf('.') > -1) {
                  if($location.protocol() == "http") {

                      localStorageService.set("btcchina_jwt", recToken, { expires: 1, domain: constant.domain, path: '/'});
                  } else {
                      localStorageService.set("btcchina_jwt", recToken, { expires: 1, domain: constant.domain, path: '/', secure: true});
                  }
                  $rootScope.$broadcast('jwtUpdated');
              }
          }
          else {
            var language = localStorageService.set("btcchina_lang");
            if (!language) {
              if (response.headers('Accept-Language')) {
                var lang = response.headers('Accept-Language');
                if (_.startsWith(lang, 'zh')) {
                  $rootScope.$broadcast('langChanged', 'zh_CN');
                }
              }
            }
          }
          return response || $q.when(response);
      },

      responseError: function(rejection) {
          if(rejection.status === 417) { // token expired
              $rootScope.$broadcast('tokenExpired');
          }
          return $q.reject(rejection);
      }
    };
  });
