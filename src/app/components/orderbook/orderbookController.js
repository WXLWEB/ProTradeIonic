'use strict'
angular.module('ProTradeIonic')
  .controller('orderBookController',function($scope, OrderBookResponse){
      $scope.OrderBookResponse = OrderBookResponse;
  });
