'use strict';

angular.module('ProTradeIonic')
  .factory('TradeList',function() {
    return {
      trades:  {},
      processIncoming: function (data) {
        var that = this;

        $log.debug("Trades Service:", data);

        if(data.MsgType == 'ExecTrade' && data.ResultCode == '0'){

          if(that.trades[data.Symbol] === undefined){
            that.trades[data.Symbol] = [];
          }

          if(data.ID === 0)
          {
              data.ID = data.Timestamp;
          }

          if(that.trades[data.Symbol].length === 0 || that.trades[data.Symbol][0].Timestamp > data.Timestamp){
            that.trades[data.Symbol].push({ID: data.ID, Timestamp:data.Timestamp, Price:data.Price, Side:data.Side, Size:data.Size});
          }
          else{
            that.trades[data.Symbol].unshift({ID: data.ID, Timestamp:data.Timestamp, Price:data.Price, Side:data.Side, Size:data.Size});
          }

          //keep last 19 trades, sort by ID
          that.trades[data.Symbol] = _.sortByOrder(that.trades[data.Symbol].slice(0, 19), 'ID',false);
        }
        $rootScope.$broadcast('updateTrade');
      },
      clearTrades: function(){
        this.trades = {};
      }
    }
  });
