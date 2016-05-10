(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');

    // Application routing
    $stateProvider
      .state('intro', {
        url: '/',
        cache: true,
        templateUrl: 'app/components/intro/intro.html',
        controller: 'introController'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/templates/main.html',
        controller: 'MainController'
      })
      .state('app.home', {
        url: '/home',
        cache: true,
        views: {
          'home-tab': {
            templateUrl: 'app/templates/views/home.html',
            controller: 'HomeController'
          }
        },
        data:{
            wsurl: 'wss://pro-ws.btcc.com:2012',
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.trade', {
        url: '/trade',
        cache: true,
        views: {
          'trade-tab': {
            templateUrl: 'app/templates/views/trade.html',
            controller: 'SettingsController'
          }
        },
        data:{
            wsurl: 'wss://pro-ws.btcc.com:2012',
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.account', {
        url: '/account',
        cache: true,
        views: {
          'account-tab': {
            templateUrl: 'app/templates/views/account.html',
            controller: 'AccountController'
          }
        },
        data:{
            wsurl: 'wss://pro-ws.btcc.com:2012',
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.account-detail', {
        url: '/account-detail',
        cache: true,
        views: {
          'account-tab': {
            templateUrl: 'app/components/accountDetail/account-detail.html',
            controller: 'AccountController'
          }
        },
        data:{
            wsurl: 'wss://pro-ws.btcc.com:2012',
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.login', {
        url: '/login',
        cache: true,
        views: {
          'account-tab': {
            templateUrl: 'app/templates/views/login.html',
            controller: 'loginController'
          }
        },
        data:{
            wsurl: 'wss://pro-ws.btcc.com:2012',
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      });


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/');
  }

})();
