'user strict';
angular.module('ProTradeIonic')
  .factory('tradeService',function($rootScope, SocketService, getUniqueID, getSignature, $log) {
    var getPrice = function(data) {
      if(data.orderType == '2'){
        return parseFloat(data.limitPrice);
      }
    };

    var getQuantity = function(data) {
      if(data.orderType == '2'){
        return data.limitQuantity;
      }
      if(data.orderType = '1'){
        return data.marketQuantity;
      }
    };

    var order = {
      MsgType:"PlaceOrder",
      SecurityType: "Crypto",
      PositionEffect: "O",
      Quantity: '0',
      Price: '0',
      StopPrice: "0",
      TIF: '1',
      ExprDate: "0",
      ExprTime: "00:00:00"
    }

    return{
      tradeRequest: function(data,side) {
        order.Side = side;
        order.ClOrdID = getUniqueID();
        order.Symbol = $rootScope.urlParameter.symbol;
        order.OrderType = data.orderType;
        order.Quantity = getQuantity(data);
        order.Price = getPrice(data)
        $log.debug('tradeInfo:',order);
        order.Signature = getSignature(order.MsgType, order.ClOrdID, order.Symbol, order.Side, order.SecurityType, order.OrderType, order.PositionEffect, order.Quantity, order.Price, order.StopPrice, order.TIF, order.ExprDate, order.ExprTime);
        var promise = SocketService.send(order);
        promise.then(//successCallback
            function (success) {
              $rootScope.$broadcast('resetForm');
              $log.debug('tradeSucess!')
            },//errorCallback
            function (error) {
              //Here we should actually still show some feedback in case the order was not sent to the server
              $rootScope.$broadcast('orderUpdated', {OrdRejReason: 'FAILED', Symbol: order.Symbol, ResultCode: '-1'});
            });
      }
    }
  })
