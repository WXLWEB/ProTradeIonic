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
      //.state('app.account', {
      //  url: '/account',
      //  cache: true,
      //  views: {
      //    'account-tab': {
      //      templateUrl: 'templates/views/settings.html',
      //      controller: 'SettingsController'
      //    }
      //  }
      //})
      // Each tab has its own nav history stack:

      //.state('app.dash', {
      //  url: '/dash',
      //  cache: true,
      //  views: {
      //    'tab-dash': {
      //      templateUrl: 'templates/views/tab-dash.html',
      //      controller: 'DashCtrl'
      //    }
      //  }
      //})

      .state('app.chats', {
        url: '/chats',
        cache: true,
        views: {
          'tab-chats': {
            templateUrl: 'app/templates/views/tab-chats.html',
            controller: 'ChatsCtrl'
          }
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
        }
      });


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/app/home');
  }

})();
