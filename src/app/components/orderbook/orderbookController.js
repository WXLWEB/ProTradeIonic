'use strict'
angular.module('ProTradeIonic')
  .controller('orderBookController',function($scope, OrderBookResponse, $log, ticker){
    $scope.OrderBookResponse = OrderBookResponse;
    $scope.ticker = ticker;

    var calculateOrderBookCount = function () {
      $log.debug('OrderBook height:',Math.floor(($('.orderbook_box').height()-40)/28));
      return Math.floor(($('.orderbook_box').height()-80)/28);
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
