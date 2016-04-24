'use strict'
angular.module('ProTradeIonic')
  .controller('placeOrderController',function(){

    
    $scope.execReport = execReport;
$scope.ticker = ticker;
$scope.accountInfo = accountInfo;
$scope.limitQty = false;
$scope.limitUp = false;
$scope.limitDown = false;
$scope.buyStopInputPriceError = false;
$scope.sellStopInputPriceError = false;
$scope.buyOCOStopInputPriceError = false;
$scope.sellOCOStopInputPriceError = false;
$scope.trades = trades;
$scope.symbol= $rootScope.urlParameter.symbol;

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

$scope.tabs = [{active: true,orderType:'limit'}, {active: false,orderType:'market'},{active: false,orderType:'stop'},{active: false,orderType:'oco'}];

$scope.$on('setInputPriceLimitUp',function(){
  $scope.limitUp = true;
});

$scope.$on('setInputPriceLimitDown',function(){
  $scope.limitDown = true;
});

$scope.$on('setBuyStopInputPriceError',function(){
  $scope.buyStopInputPriceError = true;
});

$scope.$on('setBuyOCOStopInputPriceError',function(){
  $scope.buyOCOStopInputPriceError = true;
});

$scope.$on('setSellStopInputPriceError',function(){
  $scope.sellStopInputPriceError = true;
});

$scope.$on('setSellOCOStopInputPriceError',function(){
  $scope.sellOCOStopInputPriceError = true;
});

$scope.checkPrice = function (orderType,side) {
  $log.debug('Side:',side);
  switch(side){
    case '1': //Buy
      switch (orderType) {
        case '2': //limit
          if(($scope.global.inputPrice>ticker.quote[$scope.symbol].LimitUp) && $scope.tabs[2].active === false){
            $scope.$emit('setInputPriceLimitUp');
            return true;
          }else{
            return false;
          }
          break;
        case '3': //stop
          if(($scope.global.inputPrice <= trades.trades[$scope.symbol][0].Price) && $scope.tabs[2].active === true){
            $scope.$emit('setBuyStopInputPriceError');
            return true;
          }else{
            return false;
          }
          break;
        case 'Z': //oco
          if(($scope.global.ocoInputLimitPrice>ticker.quote[$scope.symbol].LimitUp) && $scope.tabs[2].active === false){
            $scope.$emit('setInputPriceLimitUp');
            return true;
          }else if(($scope.global.ocoInputStopPrice <= trades.trades[$scope.symbol][0].Price) && $scope.tabs[3].active === true){
            $scope.$emit('setBuyStopInputPriceError');
            return true;
          }else if($scope.global.ocoInputLimitPrice >= $scope.global.ocoInputStopPrice){
            $scope.$emit('setBuyOCOStopInputPriceError');
            return true;
          }else{
            return false;
          }
          break;
        default:
          return false
      }
      break;
    case '2'://Sell
      switch (orderType) {
        case '2': //limit
          if(($scope.global.inputPrice<ticker.quote[$scope.symbol].LimitDown) && $scope.tabs[2].active === false){
            $scope.$emit('setInputPriceLimitDown');
            return true;
          }else{
            return false;
          }
          break;
        case '3': //stop
          if(($scope.global.inputPrice >= trades.trades[$scope.symbol][0].Price) && $scope.tabs[2].active === true){
            $scope.$emit('setSellStopInputPriceError');
            return true;
          }else{
            return false;
          }
          break;
        case 'Z': //oco
          if(($scope.global.ocoInputLimitPrice<ticker.quote[$scope.symbol].LimitDown) && $scope.tabs[2].active === false){
            $scope.$emit('setInputPriceLimitDown');
            return true;
          }else if(($scope.global.ocoInputStopPrice >= trades.trades[$scope.symbol][0].Price) && $scope.tabs[3].active === true){
            $scope.$emit('setSellStopInputPriceError');
            return true;
          }else if($scope.global.ocoInputLimitPrice <= $scope.global.ocoInputStopPrice){
            $scope.$emit('setSellOCOStopInputPriceError');
            return true;
          }else{
            return false;
          }
          break;
        default:

      }
      break;
  }
};

$scope.placeOrder = function (OrderType, form, type) {
  $scope.resetPrice();
  $scope.resetQuantity();
  angular.forEach($scope.form.$error.required, function(field) {
      field.$setDirty();
  });
  $log.debug("form:",$scope.form);
  if(!checkToken()){
    session.logout();
  }
  if (accountInfo.IL) {
    $scope.$emit('orderUpdated', {Status: 'FAILED', Symbol: 'Account in Liquidation'});
    return;
  }
  if(!session.hasLogin){
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

$scope.$on('resetForm',function(){
  $scope.limitUp = false;
  $scope.limitDown = false;
  $scope.global.inputPrice = '';
  $scope.global.Quantity = '';
  $scope.buyStopInputPriceError = false;
  $scope.sellStopInputPriceError = false;
  $scope.buyOCOStopInputPriceError = false;
  $scope.sellOCOStopInputPriceError = false;
  $scope.global.ocoInputLimitPrice = '';
  $scope.global.ocoInputStopPrice = '';
  $scope.form.$setPristine();
  $log.debug("form2:",$scope.form);
});

$scope.resetPrice = function(){
  $scope.limitUp = false;
  $scope.limitDown = false;
  $scope.buyStopInputPriceError = false;
  $scope.sellStopInputPriceError = false;
  $scope.buyOCOStopInputPriceError = false;
  $scope.sellOCOStopInputPriceError = false;
};
$scope.resetQuantity = function(){
  $scope.limitQty = false;
};

var amountPattern = function(Amount){
  if(Amount === undefined){
    return;
  }
  var amount = angular.copy(Amount);
  if(amount){
    if(amount.length==1){
      amount = Number(amount.toString().replace(/[^1-9]/g,''));
    }else{
      amount = Number(amount.toString().replace(/\D/g,''));
    }
  }
  return amount;
};

$scope.amountLimit = function(){
  $scope.global.Quantity = amountPattern($scope.global.Quantity);
  $log.debug('amount:',$scope.global.Quantity);
};

var pricePattern = function(Price){
  if(Price === ''){
    return;
  }
  if(Price.length==1){
    Price = Number(Price.toString().replace(/[^1-9]/g, ""));
  }else{
    if($rootScope.urlParameter.decimal === 0.1){
      Price = Number(Price.toString().replace(/[^\d.]/g, "").
        //只允许一个小数点
          replace(/^\./g, "").replace(/\.{2,}/g, ".").
        //只能输入小数点后一位
          replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'));
    }else if($rootScope.urlParameter.decimal === 0.01){
      Price = Number(Price.toString().replace(/[^\d.]/g, "").
        //只允许一个小数点
          replace(/^\./g, "").replace(/\.{2,}/g, ".").
        //只能输入小数点后两位
          replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d)(\d).*$/, '$1$2.$3$4'));
    }

  }
  return Price;
};

$scope.priceLimit = function(){
    $scope.global.inputPrice = pricePattern($scope.global.inputPrice);
};

$scope.ocoLimitPriceLimit = function(){
  $scope.global.ocoInputLimitPrice = pricePattern($scope.global.ocoInputLimitPrice);
};

$scope.ocoStopPriceLimit = function(){
  $scope.global.ocoInputStopPrice = pricePattern($scope.global.ocoInputStopPrice);
};

$scope.priceRemovelastDot = function(){
  var p = angular.copy($scope.global.inputPrice);
  if(p){
    //最后一位是小数点的话，移除
    $scope.global.inputPrice=Number($scope.global.inputPrice.toString().replace(/\.$/g, ""));
  }
};
$scope.$on('getPrice',function(event, data) {
  $scope.priceFocus = true;
  $scope.quantityFocus = true;
  if($scope.tabs[0].active){
    focus($scope.tabs[0].orderType+'Quantity');
    $scope.global.inputPrice = data;
  }else if($scope.tabs[1].active){
    focus($scope.tabs[1].orderType+'Quantity');
    $scope.global.inputPrice = data;
  }else if($scope.tabs[2].active){
    focus($scope.tabs[2].orderType+'Quantity');
    $scope.global.inputPrice = data;
  }else if($scope.tabs[3].active){
    focus($scope.tabs[3].orderType+'Quantity');
    $scope.global.ocoInputLimitPrice = data;
  }
});
$scope.$on('getQuantity',function(event,amount) {
  if(amount<=200){
      $scope.global.Quantity = amount;
  }else{
      $scope.global.Quantity = 200;
  }
  $scope.priceFocus = true;
  if($scope.tabs[0].active){
    focus($scope.tabs[0].orderType+'InputPrice');
  }else if($scope.tabs[1].active){
    focus($scope.tabs[1].orderType+'InputPrice');
  }else if($scope.tabs[2].active){
    focus($scope.tabs[2].orderType+'InputPrice');
  }else if($scope.tabs[3].active){
    focus($scope.tabs[3].orderType+'LimitInputPrice');
  }
});

$scope.$on('ReplaceOrder',function(event,Order){
  $scope.replaceOrder = true;
  switch(Order.OrderType){
    case "2":   //limit
      $scope.tabs[0].active = true;
      $scope.global.inputPrice = Order.Price;
      break;
    case "3":  //stop
      $scope.tabs[2].active = true;
      $scope.global.inputPrice = Order.StopPrice;
      break;
    case "Z": //oco
      $scope.tabs[3].active = true;
      $scope.global.ocoInputLimitPrice = Order.Price;
      $scope.global.ocoInputStopPrice = Order.StopPrice;
      $scope.global.Quantity = Order.LeaveQty;
      break;
    default:
      break;
  }
  $scope.$emit('QuantityFocus');
  $scope.Order = Order;
  $scope.global.Quantity = Order.LeaveQty;
  $log.debug('global',$scope.global.inputPrice);
});

$scope.$on('undoReplace', function () {
  $scope.$emit('resetForm');
  $rootScope.$broadcast('replacingTrBg',-1);
  $scope.replaceOrder = false;
});

$scope.undoReplace = function(){
  $scope.$emit('undoReplace');
};

$scope.cancelReplaceOrder = function (type,form) {
     $log.debug("replaceOrderInfo1:",form);
     switch (type) {
       case '2': // limit
         if(!form.limitAmount.$valid || !form.limitPrice.$valid){
           return;
         }
         break;
       case '3': // stop
         if(!form.stopAmount.$valid || !form.stopPrice.$valid){
           return;
         }
         break;
       case 'Z': // oco
         if(!form.ocoInputLimitPrice.$valid || !form.ocoInputStopPrice.$valid || !form.ocoQuantity.$valid){
           return;
         }
         break;
     }
     var CancelReplaceOrderRequest =  {
       "MsgType":'CancelReplaceOrderRequest',
       "ClOrdID":getUniqueID(),
       "OrigClOrdID":$scope.Order.OrdID,
       "Quantity":$scope.global.Quantity,
       "Price":$scope.global.inputPrice || $scope.global.ocoInputLimitPrice,
       "StopPrice":$scope.global.inputPrice || $scope.global.ocoInputStopPrice
     };
     var v = CancelReplaceOrderRequest;
     $log.debug("replaceOrderInfo2:",v);
     v.Signature = getSignature(v.MsgType, v.ClOrdID, v.OrigClOrdID, v.Quantity, v.Price, v.StopPrice);
     if($scope.checkPrice(type,$scope.Order.Side)){
       return;
     }else{
       socket.send(v).then(function () {
         $scope.undoReplace();
       });
     }
   };

  }
