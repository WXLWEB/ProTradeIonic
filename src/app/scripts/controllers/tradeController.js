'use strict';
angular.module('ProTradeIonic')
 .controller('tradeController',function($scope){
   $scope.tradeList = [
      { text: "Limit", value: "2" },
      { text: "Market", value: "1" },
    ];
    $scope.data = {
      orderType: '2'
    };
 });
