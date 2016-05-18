angular.module('ProTradeIonic')
  .controller('tradeTabController',function(Session, $state, $log) {
    if(!Session.hasLogin){
      $state.go('app.login-trade');
    }
    if(Session.hasLogin){
      $state.go('app.pro-trade-tab.trade');
    }
    // Session.login().then(function (result) {
    //   $log.debug("loginSuccess",result);
    // }, function (error) {
    //     $log.debug("Session loginFailed",error);
    //     $state.go('app.login-trade');
    // });
  });
