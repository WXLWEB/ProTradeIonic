'use strict';
angular.module('ProTradeIonic')
 .factory('ExecReport',function ($log, $rootScope, ExecTrade,constant) {
    var setUserAveragePrice = function(exec) {
      var orderQuantity = _.sum(exec.ExecutionDetails, 'TotalQuantity');
      var averagePerExec = _.map(exec.ExecutionDetails, function(detail) {
        var weight = detail.TotalQuantity / orderQuantity;
        return weight * detail.Price;
      });
      exec.userAveragePrice = _.sum(averagePerExec);
    };
    var setUserTimestamp = function(exec) {
      var details = _.get(exec, 'ExecutionDetails', []);
      var timeStamp = _.get(_.last(details), 'Timestamp');
      if (timeStamp) {
        exec.userTimestamp = timeStamp;
      }
      return exec;
    };
    return {
        executions:{},
        ocoOrders:{},
        oldExecutions: {},
        allExecutions: {},//includes canceled
        summary: {},
        ExecutionDetails:{},
        newPosition: false,
        processIncoming: function (data) {
            var that = this;
            $log.debug("execReport:", data);


            //if place order error then show failed notification
            if(data.ResultCode == "-1"){
                $rootScope.$broadcast('orderUpdated', data);
                return;
            }
            //position details
            if(!_.isEmpty(data.ExecutionDetails)){
                _.forEach(data.ExecutionDetails, function (i) {
                    if(i.OpenedQuantity !== 0){
                        var pdetail = {Price:'',OpenedQuantity:0,Quantity:0,Symbol:'',SortPrice:'',Timestamp:''};
                        pdetail.Symbol = data.Symbol;
                        pdetail.Price = i.Price;
                        pdetail.OpenedQuantity =  data.Side == "1" ? i.OpenedQuantity:-i.OpenedQuantity;
                        pdetail.SortPrice =  data.Side == "2"? i.Price :-i.Price;
                        pdetail.Quantity = i.OpenedQuantity;
                        pdetail.sellOrbuy = (data.Side == "1");
                        pdetail.Timestamp = i.Timestamp;
                        that.ExecutionDetails[data.OrdID + i.Index] = pdetail;
                    }
                    else{
                        delete that.ExecutionDetails[data.OrdID + i.Index];
                    }
                });
                $log.debug("ExecutionDetails",that.ExecutionDetails);
            }

            var now = new Date();
            var current_timestamp = now.getTime();
            var twentyFourhrs = 86400000;
            var userDate = setUserTimestamp(_.assign({}, data)).userTimestamp || data.Timestamp;
            if ((current_timestamp - userDate > twentyFourhrs) && !_.includes(['A', '0', '1'], data.Status)) {
                that.oldExecutions[data.OrdID] = data;
                return;
            }
            that.newPosition = false;
            if (!_.has(data, 'OrdID')) {
                return;
            }

          //only show broadcast notification for new orders
          if(data.Timestamp > $rootScope.lastNotificationTime){
              $rootScope.$broadcast('orderUpdated', data);
          }

          //A = pending new, 0 = new, 5 = replaced
          if(data.Status=='A' || data.Status=='0' || data.Status=='5'){
              if(data.OrderType === 'Z'){
                that.ocoOrders[data.OrdID] = data;
                $log.debug('ocoOrders:',that.ocoOrders);
              }else{
                that.executions[data.OrdID] = data;
              }
          }
          // 1 = PartiallyFilled, 2 = filled
          else if(data.Status=='1' || data.Status=='2'){
              var old = that.executions[data.OrdID];
              if(data.OrderType === 'Z'){
                that.ocoOrders[data.OrdID] = data;
                $log.debug('ocoOrders:',that.ocoOrders);
              }else{
                that.executions[data.OrdID] = data;
              }
              if(data.Timestamp > $rootScope.lastNotificationTime){
                  that.newPosition = ((old === undefined) || (data.CumQty !== old.CumQty));
                  $rootScope.lastNotificationTime = data.Timestamp;
              }
          }
          // 4 = Canceled, C = expired, G = CancelledBySystem
          if(data.Status=='4' || data.Status=='C' || data.Status=='G' || data.Status=='3'){
            if(data.OrderType === 'Z'){
              delete that.ocoOrders[data.OrdID];
            }else{
              delete that.executions[data.OrdID];
            }
          }

          //3 = DoneForDay, F = DoneForOvernight, S = DoneBySystem
          if(data.Status=='3' || data.Status=='F' || data.Status=='S' || data.Status=='7' || data.Status=='G'){
              that.executions[data.OrdID] = data;
          }

          //copy of any data that comes in, less then 24hrs old, including canceled
          that.allExecutions[data.OrdID] = _.assign({}, data);

          //calculate the average price per ExecReport
          _.forEach(that.allExecutions, setUserAveragePrice);
          _.forEach(that.allExecutions, setUserTimestamp);
        },
        logout: function () {
            var that = this;
            that.executions = {};
            that.ocoOrders = {};
            that.oldExecutions = {};
            that.allExecutions = {};//includes canceled
            that.summary = {};
            that.ExecutionDetails = {};
            that.newPosition = false;
        }
      };
  });
