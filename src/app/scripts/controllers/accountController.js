'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('ProTradeIonic')
  .controller('AccountController', function($rootScope, $scope, SocketService, $state, Session, AccountInfo, $log) {
    $scope.AccountInfo = AccountInfo;

    // if(!Session.hasLogin){
    //   $state.go('app.login-account');
    // }
    // $rootScope.$on('loginSuccess',function() {
    //     $state.go('app.account');
    // })

    $scope.signOut = function() {
      $state.go('app.login');
      Session.logout();
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
