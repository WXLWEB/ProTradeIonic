angular.module('ProTradeIonic')
  .controller('tradeTabController',function(Session, $state, $log) {
    Session.login().then(function (result) {
      $log.debug("loginSuccess",result);
    }, function (error) {
        $log.debug("Session loginFailed",error);
        $state.go('app.login');
    });
  });
