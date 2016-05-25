'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.controller:MainController
 * @description
 * # MainController
 */
angular.module('ProTradeIonic')
  .controller('MainController', function($scope, $rootScope, SocketService, Session, $state, AccountInfo) {

    $scope.Session = Session;
    Session.login();

    $scope.toIntro = function(){
      $state.go('intro');
    }

    $rootScope.$on('loginSuccess',function() {
      $scope.loginRequest();
    })

    $scope.loginRequest = function(){
      var credentials = {"MsgType":"LoginRequest",
        "Email": AccountInfo.email,
        "Account": AccountInfo.account,
        "Password": AccountInfo.password
      };
      SocketService.send(credentials).then(//successCallback
        function (success) {
            $scope.$broadcast('loginRequestSuccess');
        },//errorCallback
        function (error) {
            //$state.go('trading');
        });
    }


    //send getTradesRequest
    var getTradesRequest = function (symbol) {
        SocketService.send({"MsgType":"GetTradesRequest","Count":"20", Symbol:symbol});
    };

    // listening orderbook
    var sendGetOrdersRequest = function () {
        var ordersAllParam = {"MsgType": "GetOrdersRequest", "Status": "A,0,1,2", "Begin": '0', End: Date.now().toString()};
        ordersAllParam.Signature = getSignature(ordersAllParam.MsgType, ordersAllParam.Begin, ordersAllParam.End, ordersAllParam.Status);
        SocketService.send(ordersAllParam);
        var ordersExecutionsParam = {"MsgType": "GetOrdersRequest", "Status": "3,S", "Begin": (Date.now()-1000*60*60*24).toString(), End: Date.now().toString()};
        ordersExecutionsParam.Signature = getSignature(ordersExecutionsParam.MsgType, ordersExecutionsParam.Begin, ordersExecutionsParam.End, ordersExecutionsParam.Status);
        SocketService.send(ordersExecutionsParam);
    };

    //send getQuoteRequest
    var getQuoteRequest = function (symbol) {
        var quoteParam = {
            "MsgType": "QuoteRequest",
            "QuoteType": "2",
            "Symbol": symbol
        };
        SocketService.send(quoteParam);
    };

    //setup trading
    var setup_trading = function () {
        getTradesRequest($rootScope.urlParameter.symbol);
        getQuoteRequest($rootScope.urlParameter.symbol);
        getQuoteRequest($rootScope.urlParameter.bpi);
    };
    var firstWSOpened = false;
    $scope.$on('wsOpened', function () {
        //do something when te websocket connection is opened
        // startLogin();
        setup_trading();
        $scope.wsOpened = true;
        firstWSOpened = true;
    });

  });
