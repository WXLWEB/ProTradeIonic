'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('ProTradeIonic')
  .controller('AccountController', function($scope, SocketService, $state, Session, AccountInfo, $log) {
    $scope.AccountInfo = AccountInfo;
    Session.login().then(function (result) {
      $log.debug("loginSuccess",result);
        // Session.getLoginInfo(result);
    }, function (error) {
        $log.debug("loginSuccess",error);
        $state.go('app.login');
    });


    $scope.$on('loginSuccess',function() {
      $scope.loginRequest();
    })

    $scope.loginRequest = function(){
      var credentials = {"MsgType":"LoginRequest",
              "Email": AccountInfo.email,
              "Account": AccountInfo.account,
              "Password": AccountInfo.password};
          //resend the login request when the ws re-opens
          SocketService.send(credentials).then(//successCallback
              function (success) {
                  //socket.send({"MsgType":"GetRiskProfilesRequest"})
                  // sendGetOrdersRequest();//make the OrederRequest
                  //$state.go('trading');
                  $scope.$broadcast('loginRequestSuccess');
              },//errorCallback
              function (error) {
                  //$state.go('trading');
              });
    }

    // $scope.toLoginPage = function() {
    // };
    // just an example...
    //$scope.fetchRandomText = function() {
    //  ExampleService.doSomethingAsync()
    //    .then(ExampleService.fetchSomethingFromServer)
    //    .then(function(response) {
    //        $scope.myHTML = response.data.text;
    //        // close pull to refresh loader
    //        $scope.$broadcast('scroll.refreshComplete');
    //    });
    //};

    //$scope.fetchRandomText();
  });