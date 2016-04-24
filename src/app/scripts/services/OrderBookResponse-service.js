'use strict'

/**
 * @ngdoc function
 * @name ProTradeIonic.service:ProTradeIonic
 * @description
 * # ProTradeIonic
 */
angular.module('ProTradeIonic')
  .factory('OrderBookResponse',function($rootScope, $filter, $log) {
    var calculateOrderBookCount = function () {
      $log.debug('OrderBook height:',Math.floor(($('.orderbook_box').height()-40)/28));
      return Math.floor(($('.orderbook_box').height()-80)/28);
    };
    return {
        orderbook:  {ask: [], bid: []}, askData: {}, bidData: {}, version: 0,
        processIncoming: function (data,mergeOrderbookArgs,mergeMaketDepthArgs) {
            var that = this;
            $rootScope.$on('wsOpened', function () {
                //do something when te websocket connection is opened
                that.version = 0;
            });
            if(data == null)
            return;
            $log.debug("Orderbooks:", data);
            if(data.Type === "F"){
                that.version = data.Version;
                that.askData = {};
                that.bidData = {};
                //divide the ask or bid orders
                _.forEach(data.List, function (n, key) {
                    if(n.Side === "1"){
                        that.bidData[n.Price] = {Price: n.Price, Quantity: n.Size};
                    }else if(n.Side === "2"){
                        that.askData[n.Price] = {Price: n.Price, Quantity: n.Size};
                    }
                });
            }else if(data.Type === "I"){
                // if version = 32767
                return;
                if (data.Version >= 32767)
                    that.version = 0;
                else
                    that.version++;
                // check if orderbook.version + 1 = version
                // if not do new quote request
                if(that.version !== data.Version){
                    $log.debug('wrong version!',data.Symbol);
                    $rootScope.$broadcast('SendQuoteRequest',data.Symbol);
                    return;
                }else{
                    //divide the ask or bid orders
                    _.forEach(data.List, function (n, key) {
                        if(n.Side == "1"){
                            var obj = that.bidData[n.Price];
                            if(obj == null){
                                that.bidData[n.Price] = {Price: n.Price, Quantity: n.Size};
                            }else{
                                var qty = obj.Quantity + n.Size;
                                if(qty === 0){
                                    delete that.bidData[n.Price];
                                }
                                else {
                                    that.bidData[n.Price].Quantity = qty;
                                }
                            }
                        }else if(n.Side === "2"){
                            var obj2 = that.askData[n.Price];
                            if(obj2 == null){
                                that.askData[n.Price] = {Price: n.Price, Quantity: n.Size};
                            }else{
                                var qty2 = obj2.Quantity + n.Size;
                                if(qty2 === 0){
                                    delete that.askData[n.Price];
                                }
                                else {
                                    that.askData[n.Price].Quantity = qty2;
                                }
                            }
                        }
                    });
                }
            }

            // compute display orderbook

            var totalAskSize = 0;
            var totalBidSize = 0;

            that.orderbook.ask = [];
            that.orderbook.bid = [];
            //sort by desc in askArray
            _.forEach(_.slice(_.sortBy(_.toArray(that.askData),'Price',true),0,calculateOrderBookCount()), function (n,key){
                totalAskSize += n.Quantity;
                that.orderbook.ask.push({Price: n.Price, Quantity :n.Quantity, Total : totalAskSize});
            });

            //sort by asc in bidArray
            _.forEach(_.slice(_.sortBy(_.toArray(that.bidData),'Price',false),0,calculateOrderBookCount()), function (n,key){
                totalBidSize += n.Quantity;
                that.orderbook.bid.push({Price: n.Price, Quantity :n.Quantity, Total : totalBidSize});
            });
            $log.debug("bidData",that.orderbook.bid);
            $log.debug("askData",that.orderbook.ask);

            if(mergeOrderbookArgs !== 0){
                $rootScope.$broadcast('groupOrderBook',mergeOrderbookArgs);
            }
            $rootScope.$broadcast('groupMarketDepth',mergeMaketDepthArgs);

        }
    };
  });
