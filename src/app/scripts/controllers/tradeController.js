'use strict';
angular.module('ProTradeIonic')
 .controller('tradeController',function($rootScope, $scope, Session, $log, $state, Ticker, TradeList, tradeService, AccountInfo, ipCookie, localStorageService){
   $scope.tradeList = [
      { text: "Limit", value: "2" },
      { text: "Market", value: "1" },
    ];
    $scope.data = {
      orderType: '2',
      limitPrice:'',
      limitQuantity:'',
      marketQuantity:''
    };

    $scope.placeOrderInfo = {
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

    $scope.checkPrice = function (data,side) {
      $log.debug('Side:',side);
      switch(side){
        case '1': //Buy
          switch (data.orderType) {
            case '2': //limit
              if(data.limitPrice>Ticker.quote[$rootScope.urlParameter.symbol].LimitUp){
                $log.debug('limitUpPrice:',Ticker.quote[$rootScope.urlParameter.symbol].LimitUp);
                $scope.$emit('setInputPriceLimitUp');
                return true;
              }
              return false;
              break;
            // case '3': //stop
            //   if((data.price <= TradeList.trades[$rootScope.urlParameter.symbol][0].Price) && $scope.tabs[2].active === true){
            //     $scope.$emit('setBuyStopInputPriceError');
            //     return true;
            //   }else{
            //     return false;
            //   }
            //   break;
            // case 'Z': //oco
            //   if(($scope.global.ocoInputLimitPrice>Ticker.quote[$rootScope.urlParameter.symbol].LimitUp) && $scope.tabs[2].active === false){
            //     $scope.$emit('setInputPriceLimitUp');
            //     return true;
            //   }else if(($scope.global.ocoInputStopPrice <= TradeList.trades[$rootScope.urlParameter.symbol][0].Price) && $scope.tabs[3].active === true){
            //     $scope.$emit('setBuyStopInputPriceError');
            //     return true;
            //   }else if($scope.global.ocoInputLimitPrice >= $scope.global.ocoInputStopPrice){
            //     $scope.$emit('setBuyOCOStopInputPriceError');
            //     return true;
            //   }else{
            //     return false;
            //   }
            //   break;
            default:
              return false
          }
          break;
        case '2'://Sell
          switch (data.orderType) {
            case '2': //limit
              if((data.liimtPrice<Ticker.quote[$rootScope.urlParameter.symbol].LimitDown) && $scope.tabs[2].active === false){
                $scope.$emit('setInputPriceLimitDown');
                return true;
              }else{
                return false;
              }
              break;
            // case '3': //stop
            //   if((data.price >= TradeList.trades[$rootScope.urlParameter.symbol][0].Price) && $scope.tabs[2].active === true){
            //     $scope.$emit('setSellStopInputPriceError');
            //     return true;
            //   }else{
            //     return false;
            //   }
            //   break;
            // case 'Z': //oco
            //   if(($scope.global.ocoInputLimitPrice<Ticker.quote[$rootScope.urlParameter.symbol].LimitDown) && $scope.tabs[2].active === false){
            //     $scope.$emit('setInputPriceLimitDown');
            //     return true;
            //   }else if(($scope.global.ocoInputStopPrice >= TradeList.trades[$rootScope.urlParameter.symbol][0].Price) && $scope.tabs[3].active === true){
            //     $scope.$emit('setSellStopInputPriceError');
            //     return true;
            //   }else if($scope.global.ocoInputLimitPrice <= $scope.global.ocoInputStopPrice){
            //     $scope.$emit('setSellOCOStopInputPriceError');
            //     return true;
            //   }else{
            //     return false;
            //   }
            //   break;
            default:

          }
          break;
      }
    };

    $scope.$on('resetForm',function(){
      $scope.limitUp = false;
      $scope.limitDown = false;
      $scope.data.Price = '';
      $scope.data.Quantity = '';
      $log.debug("form2:",$scope.form);
    });

    $scope.placeOrder = function (form, data, side) {
      // $scope.resetPrice();
      // $scope.resetQuantity();
      $log.debug("form:",form);
      angular.forEach(form.$error.required, function(field) {
          field.$setDirty();
      });
      // if(!Session.checkToken()){
      //   Session.logout();
      //   //go to login page
      //   $state.go('app.login');
      //   return;
      // }
      // if(!Session.hasLogin){
      //   $log.debug('hasLogin:',Session.hasLogin);
      //   $state.go('app.login');
      // }
      if (AccountInfo.IL) {
        $scope.$emit('orderUpdated', {Status: 'FAILED', Symbol: 'Account in Liquidation'});
        return;
      }
      // if(ipCookie("btcc_epa_accept") !== true && localStorageService.get('btcc_epa_accept') !== true){
      //   $rootScope.$broadcast('startEPANoteCheck');
      //   return;
      // }
      // var v = angular.copy($scope.placeOrderInfo);
      // v.OrderType = OrderType;
      // $log.debug('OrderType:',v.OrderType);
      if($scope.checkPrice(data,side)){
        return;
      }

      if(data.OrderType == '1' && form.marketQuantity.$invalid) {
        return;
      }

      if(data.OrderType == '2' && (form.limitQuantity.$invalid || form.limitPrice.$invalid)) {
        return;
      }

      // v.ClOrdID = getUniqueID();
      // // 0: Day, 1: GTC
      // v.TIF = (v.TIF === false) ? "1" : "0";
      // v.Price = parseFloat(v.Price);

      tradeService.tradeRequest(data,side);
      //
      // v.Signature = getSignature(v.MsgType, v.ClOrdID, v.Symbol, v.Side, v.SecurityType, v.OrderType, v.PositionEffect, v.Quantity, v.Price, v.StopPrice, v.TIF, v.ExprDate, v.ExprTime);
      // var promise = socket.send(v);
      // $rootScope.$broadcast('orderUpdated', {Status: 'SENDINGTOSERVER', Symbol: v.Symbol, ResultCode: '0'});
      // promise.then(//successCallback
      //     function (success) {
      //       $scope.$emit('resetForm');
      //     },//errorCallback
      //     function (error) {
      //       //Here we should actually still show some feedback in case the order was not sent to the server
      //       $rootScope.$broadcast('orderUpdated', {OrdRejReason: 'FAILED', Symbol: v.Symbol, ResultCode: '-1'});
      //     });

    };

 });
