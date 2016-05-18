'use strict';
angular.module('ProTradeIonic')
  .factory('Session',function($rootScope, $q, $http, $interval, authService, logoutService, ipCookie, AccountInfo, $log, localStorageService, constant) {
    return {
      hasLogin: false,
      errorMessage: false,
      checkToken: function () {
        var token = localStorageService.get("btcchina_jwt",{domain: constant.domain});
        if (!token) {
          return false;
        }
        return true;
      },
      setLogin: function (logged_in) {
          this.hasLogin = logged_in;
      },
      logout: function () {
        var that = this;
        var login_out = $q.defer();
        logoutService.logout({})
            .then(function(result){
              $log.debug('getUserAccountInfo:', result);
              that.hasLogin = false;
              that.email = false;
              localStorageService.remove("btcchina_jwt");
              $rootScope.$broadcast('logoutRequestSuccess');
              // execReport.logout();
              AccountInfo.logout();
            },function(error){
              login_out.reject(error);
            });
      },
      login: function () {
        var that = this;
        var login_result = $q.defer();
        $log.debug('loginCookie:',this.checkToken());
        if(this.checkToken() == false){
          login_result.reject();
          return login_result.promise;
        }
        if (this.checkToken() == true) {
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
              localStorageService.remove("btcchina_jwt", {domain: constant.domain});
              execReport.logout();
              accountInfo.logout();
            });
          return login_result.promise;
        }
      }
    };
  });
