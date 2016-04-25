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
      .state('app.chats', {
        url: '/chats',
        cache: true,
        views: {
          'tab-chats': {
            templateUrl: 'app/templates/views/tab-chats.html',
            controller: 'ChatsCtrl'
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
      .state('app.chat-detail', {
        url: '/chats/:chatId',
        cache: true,
        views: {
          'tab-chats': {
            templateUrl: 'app/templates/views/chat-detail.html',
            controller: 'ChatDetailCtrl'
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
          'tab-account': {
            templateUrl: 'app/templates/views/tab-account.html',
            controller: 'AccountCtrl'
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
