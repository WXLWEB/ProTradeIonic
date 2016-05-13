'use strict';
angular.module('ProTradeIonic')
 .controller('tradeController',function($rootScope, $scope, Session, $log){
   $scope.tradeList = [
      { text: "Limit", value: "2" },
      { text: "Market", value: "1" },
    ];
    $scope.data = {
      orderType: '2'
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

    $scope.placeOrder = function (data, type) {
      // $scope.resetPrice();
      // $scope.resetQuantity();
      $log.debug("form:",$scope.form);
      angular.forEach($scope.form.$error.required, function(field) {
          field.$setDirty();
      });
      if(!Session.checkToken()){
        Session.logout();
      }
      if (accountInfo.IL) {
        $scope.$emit('orderUpdated', {Status: 'FAILED', Symbol: 'Account in Liquidation'});
        return;
      }
      if(!Session.hasLogin){
        $scope.animationsEnabled = true;
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'trading/components/login/login.html',
          controller: 'loginCtrl',
          size: 'login'
        });
      }else if(ipCookie("btcc_epa_accept") !== true && localStorageService.get('btcc_epa_accept') !== true){
        $rootScope.$broadcast('startEPANoteCheck');
      }
      else {
        var v = angular.copy($scope.placeOrderInfo);
        v.OrderType = OrderType;
        $log.debug('OrderType:',v.OrderType);
        if($scope.checkPrice(v.OrderType,type)){
          return;
        }
        switch (v.OrderType) {
          case '1': //market
            v.Quantity = $scope.global.Quantity;
            v.Price = 0;
              if(form.marketAmount.$invalid){
                return;
              }
            break;
          case '2': // limit
            v.Price = $scope.global.inputPrice;
            v.Quantity = $scope.global.Quantity;
            if(form.limitAmount.$invalid || form.limitPrice.$invalid){
              return;
            }
            break;
          case '3': // stop
            v.Price = "0";
            v.StopPrice = $scope.global.inputPrice;
            v.Quantity = $scope.global.Quantity;
            if(form.stopAmount.$invalid || form.stopPrice.$invalid){
              return;
            }
            break;
          case 'Z': //OCO
           v.Price = $scope.global.ocoInputLimitPrice;
           v.StopPrice = $scope.global.ocoInputStopPrice;
           v.Quantity = $scope.global.Quantity;
           if(form.ocoInputLimitPrice.$invalid || form.ocoInputStopPrice.$invalid || form.ocoQuantity.$invalid){
             return;
           }
           break;
        }

        if(!$scope.limitUp && !$scope.limitDown){
          if (type === '1') { // buy
            v.Side = '1';
          } else if (type === '2') { // sell
            v.Side = '2';
          }
          v.ClOrdID = getUniqueID();
          // 0: Day, 1: GTC
          v.TIF = (v.TIF === false) ? "1" : "0";
          v.Price = parseFloat(v.Price);

          v.Signature = getSignature(v.MsgType, v.ClOrdID, v.Symbol, v.Side, v.SecurityType, v.OrderType, v.PositionEffect, v.Quantity, v.Price, v.StopPrice, v.TIF, v.ExprDate, v.ExprTime);
          var promise = socket.send(v);
          $rootScope.$broadcast('orderUpdated', {Status: 'SENDINGTOSERVER', Symbol: v.Symbol, ResultCode: '0'});
          promise.then(//successCallback
              function (success) {
                $scope.$emit('resetForm');
              },//errorCallback
              function (error) {
                //Here we should actually still show some feedback in case the order was not sent to the server
                $rootScope.$broadcast('orderUpdated', {OrdRejReason: 'FAILED', Symbol: v.Symbol, ResultCode: '-1'});
              });
        }
      }
    };

 });
