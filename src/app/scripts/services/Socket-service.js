'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.service:SocketService
 * @description
 * # SocketService
 */
angular.module('ProTradeIonic')
  // use factory for services
  .factory('SocketService', function($websocket, $log, $rootScope, $interval, getSignature, OrderBookResponse, Ticker, ExecTrade, AccountInfo, Session) {
      var ws = false;
      var reconnection;
      $rootScope.groupOrderbookArgs = 0;
      $rootScope.$on('orderBookArgs',function(event,data){
        $rootScope.groupOrderbookArgs = data;
      });
      $rootScope.groupMarketDepthArgs = 100;
      $rootScope.$on('marketDepthArgs',function(event,data){
        $rootScope.groupMarketDepthArgs = data;
      });
      var initWSCallbacks = function () {
        ws.onOpen(function (msg) {
          $rootScope.$broadcast('wsOpened');
          $log.debug('websocket connection');
          if (angular.isDefined(reconnection)) {
            $interval.cancel(reconnection);
            reconnection = undefined;
          }
        });
        ws.onMessage(function (message) {
          var data = message.data;
          data = JSON.parse(data);
          var type = data.MsgType;
          if(type != 'Heartbeat'){
            $log.debug(data);
          }
          switch (type) {
            case 'Heartbeat':
              break;
            case 'ErrorResponse':
              if (data.ResultCode == '0') {
                Session.setLogin(false);
              }
              $log.error('errorresponse:', data);
              break;
            // case 'GetRiskProfilesResponse':
            //   riskProfile.processIncoming(data);
            //   break;
            case 'AccountInfo':
              $log.debug("AccountInfo:", data);
              AccountInfo.processIncoming(data);
              var is_logged_in = (data.ResultCode === '0') || false;
              Session.setLogin(is_logged_in);
              break;
            // case 'ExecReport':
            //   execReport.processIncoming(data);
            //   break;
            // case 'ExecTransactions':
            //   orderHistory.processIncoming(data);
            //   break;
            case 'Ticker':
              $log.debug("Ticker:", data);
              Ticker.processIncoming(data);
              // execReport.processIncoming({});
              // accountInfo.processIncoming();
              break;
            case 'ExecTrade':
              $log.debug("ExecTrade:", data);
              ExecTrade.processIncoming(data);
              break;
            // case 'GetTradesResponse':
            //   $log.debug("GetTradesResponse:", data);
            //   trades.clearTrades();
            //   _.forEach(data.Trades, function (trade) {
            //     trades.processIncoming(trade);
            //   });
            //   break;
            // //case 'GetActiveContractsResponse':
            // //  $log.debug("GetActiveContractsResponse:", data);
            // //  ticker.activeContracts = data.Contracts;
            // //  break;
            // case 'MarketStatusChangedResponse':
            //   $log.debug("MarketStatusChangedResponse:",data);
            //   marketStatus.processIncoming(data);
            //   break;
            // case 'OrderCancelReject':
            //   execReport.processIncoming(data);
            //   break;
            case 'OrderBookResponse':
              $log.debug("OrderBookResponse:",data);
              OrderBookResponse.processIncoming(data,$rootScope.groupOrderbookArgs,$rootScope.groupMarketDepthArgs);
              break;
            default:
              $log.debug('have something no handle:' + JSON.stringify(data));
          }
        });

        ws.onError(function (msg) {
          $log.error(msg);
          $rootScope.$broadcast('wsClosed');
        });

        ws.onClose(function (msg) {
          $log.debug('websocket is disconnection');
          $rootScope.$broadcast('wsClosed');
        });
      };

      var getAndOpenWSConn = function (url) {
        ws = $websocket(url);
      };

      getAndOpenWSConn($rootScope.urlParameter.wsurl);
      initWSCallbacks();

      $rootScope.$on("reconnectTOWebsocket", function () {
        reconnection = $interval(function () {
          getAndOpenWSConn($rootScope.urlParameter.wsurl);
          initWSCallbacks();
        },10000);

      });

      return {
        send: function (param) {
          $log.debug("sent param:", param);
          if (!_.has(param, 'Signature')) {
            // param.Signature = _.spread(getSignature)(_.valuesIn(param));
          }
          return ws.send(JSON.stringify(param));//TODO: add a then/error clause and log success/error
        },
        isReady: function () {
          return ws.readyState;
        }
      };

  });
