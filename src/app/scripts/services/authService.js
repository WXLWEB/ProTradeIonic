'use strict';

angular.module('ProTradeIonic')
  .service('authService',function(jsonrpc, constant){
    var service = jsonrpc.newService(null, constant.apiurl + '/api.php/account');
    this.getUserAccountInfo = service.createMethod('getUserAccountInfo');
    this.getBalance = service.createMethod('getBalance');
    this.createFuturesAccount = service.createMethod('createFuturesAccount');
  });
