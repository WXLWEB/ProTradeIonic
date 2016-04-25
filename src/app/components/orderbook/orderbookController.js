'use strict'
angular.module('ProTradeIonic')
  .controller('orderBookController',function($scope, OrderBookResponse, $log, Ticker, ExecTrade){
    $scope.OrderBookResponse = OrderBookResponse;
    $scope.Ticker = Ticker;
    $scope.ExecTrade = ExecTrade;

    var calculateOrderBookCount = function () {
      $log.debug('OrderBook height:',$('.orderbook_box').height());
      return Math.floor(($('.orderbook_box').height()-85)/30);
    };

    var calculateNullData = function(){
      var rv = {Price:"-",Quantity:"-",Total:"-"};
      var ro = [];
      for(var i = 0; i<calculateOrderBookCount();i++){
          ro[i] = rv;
      }
      $scope.nullData = ro;
    };

    $(window).resize(function(){
        calculateNullData();
        $scope.orderBookCount = calculateOrderBookCount();
    });

    // $('.orderbook_box').change(function(e){
        // calculateNullData();
        // $scope.orderBookCount = calculateOrderBookCount();
    // });


    $scope.$watch(function(){
       return{
         height:angular.element('.orderbook_box').height()
       }
     },function(){
         $log.debug('orderbookHeight:',angular.element('.orderbook_box').height());
         calculateNullData();
         $scope.orderBookCount = calculateOrderBookCount();
     },
   true);

  });
