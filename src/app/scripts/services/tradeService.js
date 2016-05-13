'user strict';
angular.module('ProTradeIonic')
  .factory('tradeService',function($rootScope) {
    var placeOrderInfo = {
      MsgType: 'PlaceOrder',
      SecurityType: 'Crypto',
      PositionEffect: "O", //
      Quantity: '0',
      Price: '0',
      StopPrice: "0",
      TIF: false,
      ExprDate: '0',
      ExprTime: '00:00:00',
      Symbol:$rootScope.urlParameter.symbol
    };
    return{
      tradeRequest: function() {

      }
    }
  })
