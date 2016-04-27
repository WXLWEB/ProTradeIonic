'use strict'

/**
 * @ngdoc function
 * @name ProTradeIonic.service:ProTradeIonic
 * @description
 * # ProTradeIonic
 */
angular.module('ProTradeIonic')
  .factory('AccountInfo',function(Ticker) {
    var calculateTotalProfit = function(accountInfo) {
        var totalProfit = _.sum(accountInfo.CDL, 'profit');
        return totalProfit;
    };

    var calculateTotalEquity = function(accountInfo) {
      return accountInfo.C + calculateTotalProfit(accountInfo);
    };

    var calculateUsableMargin = function (cash, profit, initialMarginRequired) {
      var usable = ((cash + ((profit > 0) ? 0 : profit)) - initialMarginRequired);
      if (usable < 0) {
        usable = 0;
      }
      return usable;
    };

    var calculateCurrentValuation = function(symbol, openPosition) {
      return (ticker.contractTickerLastPrice[symbol] * Math.abs(openPosition)) || 0;
    };
    return{
      email:'',
      password:'',
      accountKey:'',
      processIncoming: function(data) {
        var that = this;
      },
      getLoginInfo: function(data) {
        var that = this;
        that.email = data.email;
        that.account = data.id;
        that.password = data.account_key;
        //$rootScope.email = data.account.email;
        that.accountKey = new jsSHA(data.account_key, "TEXT").getHash("SHA-1", "B64");
      }
    }
  });
