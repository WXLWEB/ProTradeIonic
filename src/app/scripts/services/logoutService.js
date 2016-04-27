angular.module('ProTradeIonic')
  .service('logoutService',function(jsonrpc, constant) {
    var service = jsonrpc.newService(null, constant.apiurl + '/api.php/account');
    this.logout = service.createMethod('logout');
  });
