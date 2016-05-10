'use strict';
angular.module('ProTradeIonic')
  .factory('Session',function($rootScope, $q, $http, $interval, authService, logoutService, ipCookie, AccountInfo, $log) {
    var checkToken = function () {
      $http.get('/');//first get a new cookie from the server
      var token = ipCookie("btcchina_jwt");
      if (!token) {
        return false;
      }
      return true;
    };
    return {
      hasLogin: false,
      errorMessage: false,
      setLogin: function (logged_in) {
          this.hasLogin = logged_in;
      },
      logout: function () {
        var that = this;
        var login_out = $q.defer();
        logoutService.logout({})
            .success(function(result){
              $log.debug('getUserAccountInfo:', result);
              that.hasLogin = false;
              that.email = false;
              ipCookie.remove("btcchina_jwt", {domain: 'btcc.com'});
              $rootScope.$broadcast('logoutRequestSuccess');
              execReport.logout();
              accountInfo.logout();
            }).error(function(error){
              login_out.reject(error);
            });
      },
      login: function () {
        var that = this;
        var login_result = $q.defer();
        $log.debug('loginCookie:',checkToken());
        if(checkToken() == false){
          login_result.reject();
          return login_result.promise;
        }
        if (checkToken() == true) {
          authService.getUserAccountInfo({})
             .then(function (result) {
                $log.debug('getLoginInfo:',result);
                AccountInfo.getLoginInfo(result.account);
                $rootScope.$broadcast('loginSuccess');
                if(result.account){
                  $log.debug("account_permission",result.account.account_permission);
                  if((result.account.account_permission & 16) === 0){
                    //$log.debug("forwards account permission not enabled "+result.account.account_permission & 16);
                    $log.debug("permission_denied");
                    that.errorMessage = "LOGIN.ERROR.PERMISSION_DENIED";
                    login_result.reject("permission_denied");
                    return;
                  }

                  if(result.account.forwards_tos_accepted !== true) {
                    $log.debug("tos_not_accepted");
                    that.errorMessage = "LOGIN.ERROR.TOS_NOT_ACCEPTED";
                    login_result.reject("tos_not_accepted");
                    $rootScope.$broadcast('tosNotAccepted');
                    return;
                  }
                    $log.debug("forwards access allowed");
                    that.hasLogin = true;
                    $rootScope.$broadcast('tosAccepted');
                    login_result.resolve(result);
                }
            },function (error) {
              $log.error("getUserAccountInfo:", error);
              login_result.reject(error);
              ipCookie.remove("btcchina_jwt", {domain: 'btcc.com'});
              execReport.logout();
              accountInfo.logout();
            });
          return login_result.promise;
        }
      }
    };
  });
