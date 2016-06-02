'use strict'

/**
 * @ngdoc function
 * @name ProTradeIonic.service:ProTradeIonic
 * @description
 * # ProTradeIonic
 */
angular.module('ProTradeIonic')
  .factory('AccountInfo',function($log,$rootScope,Ticker) {
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
      return (Ticker.contractTickerLastPrice[symbol] * Math.abs(openPosition)) || 0;
    };

    var calculateMaxQty = function(symbol, usableMargin, IMF) {
      return usableMargin < 0 ? 0 : Math.floor(usableMargin / (Ticker.quote[symbol].Last * IMF))
    }
    return{
      email:'',
      password:'',
      accountKey:'',
      accountInfo: {CDL: [], C: 0, UFS:0},
      detailMarginList: {},
      positiveDetailMarginList: {},
      totalEquity: 0,
      totalProfit: 0,
      currentValuation: 0,
      processIncoming: function(data) {
        var that = this;
        var updatePositions = function(position) {
          var lastPrice = Ticker.contractTickerLastPrice[position.S];
          position.profit = position.OS * (lastPrice - position.AP);
          position.marketValue = Math.abs(position.OS) * Ticker.contractTickerLastPrice[position.S];
          position.initialMargin = _.max([position.TBS, position.TSS]) * lastPrice * position.IMF;
          that.detailMarginList[position.S] = position;
        };
        if (data) {
          //don't update accountInfo with empty data
          that.accountInfo = data;
        }
        _.forEach(_.get(that.accountInfo, 'CDL', []), updatePositions);//update existings positons when Ticker changes
        _.forEach(that.detailMarginList, function(i) {
          //update valuation, needs to run everytim new Ticker data comes in.
          i.currentValuation = calculateCurrentValuation(i.S, 1, that.detailMarginList);
        });
        that.positiveDetailMarginList = _.transform(that.detailMarginList, function(result, n, key) {
          if (n.OS !== 0){
            result[key] = n;
            return result;
          }
        });
        that.totalEquity = calculateTotalEquity(that.accountInfo);
        that.totalProfit = calculateTotalProfit(that.accountInfo);
        //usable marging = totalEquity - initialMarginRequired or 0
        that.initialMarginRequired = _.sum(that.accountInfo.CDL, 'initialMargin');
        that.usableMargin = calculateUsableMargin(that.accountInfo.C, that.totalProfit, that.initialMarginRequired);
        that.maxQty = calculateMaxQty($rootScope.urlParameter.symbol, that.usableMargin, that.detailMarginList[$rootScope.urlParameter.symbol].IMF);
      },
      getLoginInfo: function(data) {
        var that = this;
        that.email = data.email;
        that.account = data.id;
        that.password = data.account_key;
        //$rootScope.email = data.account.email;
        that.accountKey = new jsSHA(data.account_key, "TEXT").getHash("SHA-1", "B64");
      },
      logout: function () {
        var that =this;
        that.accountKey = '';
        that.email = '',
        that.password = '',
        that.maxQty = '',
        that.accountInfo = {CDL: [], C: 0, UFS:0};
        that.detailMarginList = {};
        that.initialMarginRequired = 0;
        that.usableMargin = 0;
        that.positiveDetailMarginList = {};
        that.totalEquity = 0;
        that.totalProfit = 0;
        that.currentValuation= 0;
      }
    }
  });
