'use strict';
angular.module('ProTradeIonic')
 .controller('pendingOrdersController',function($scope, ExecReport){
    $scope.ExecReport = ExecReport;
 });
