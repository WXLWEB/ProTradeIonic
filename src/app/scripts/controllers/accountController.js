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
      $state.go('app.account');
    })
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
