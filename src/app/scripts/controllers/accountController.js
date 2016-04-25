'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('ProTradeIonic')
  .controller('AccountController', function($scope, SocketService, $state) {
    // $scope.toLogin = function(){
      $state.href('app.login');
    // }
    console.log('Status:',$state);
    // $scope.toLogin();
    $scope.myHTML = null;
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
