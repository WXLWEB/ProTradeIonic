'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.service:tickerService
 * @description
 * # SocketService
 */
angular.module('ProTradeIonic')
  // use factory for services
  .factory('Ticker',function ($log, $rootScope) {
    var ticker = {
      quote: {},
      contractTickerLastPrice: {},
      preLastPrice: {value: 0, sub: 0},
      activeContracts: [$rootScope.urlParameter.symbol],
      totalOpenInterest: 0,
      totalVolume: 0,
      proVolume:0,
      spotVolume:0,
      processIncoming: function (data) {
        var that = this;
        that.contractTickerLastPrice[data.Symbol] = data.Last;
        if ((that.preLastPrice.timeStamp !== data.Timestamp) && data.Symbol === 'XBTCNY') {
          if ((data.Last - that.preLastPrice.value) !== 0) {
            //only update if the price actually changed
            that.preLastPrice.sub = data.Last - that.preLastPrice.value;
          }
          that.preLastPrice.value = data.Last;
          that.preLastPrice.timeStamp = data.Timestamp;
        }
        // document.title = data.Last + '-' +
        var replaceKeys = function(newKeys) {
          return function (result, n, key) {
            var replacement = newKeys[key];
            if (replacement) {
              result[replacement] = n;
            }
            if (replacement === null) {
              return result;
            }
            else {
              result[key] = n;
              return result;
            }
          };
        };
        that.quote[data.Symbol] = _.transform(data, replaceKeys(
          {
            ExecutionLimitUp: 'LimitUp',
            ExecutionLimitDown: 'LimitDown',
            LimitUp: null,
            LimitDown: null
          }
        ));
        that.quote[data.Symbol].change = (data.Last - data.PrevCls);
        that.quote[data.Symbol].percent = (data.Last - data.PrevCls) / data.PrevCls * 100;
        //$log.info('this.contractTickerLastPrice', this.contractTickerLastPrice);

        that.totalOpenInterest = 0;

        //calculate exchange total open interest and volume
        _.forOwn(that.quote, function (item, symbol) {
          that.totalOpenInterest += item.OpenInterest;
          if(symbol  === $rootScope.urlParameter.symbol ){
            that.proVolume = item.Volume24H;
          }else if(symbol  === $rootScope.urlParameter.bpi ){
            that.spotVolume = item.Volume;
          }
          that.totalVolume = that.proVolume+that.spotVolume;
        });
        $rootScope.$broadcast('updateTicker');
      }
    };
    return ticker;
});
