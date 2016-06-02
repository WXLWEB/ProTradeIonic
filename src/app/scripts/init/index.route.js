(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider, constant) {
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
      .state('app.tabs', {
        url: '/tabs',
        cache: true,
        views: {
          'menuContent': {
            templateUrl: 'app/templates/views/tabs.html',
            controller: 'tabsController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.home', {
        url: '/home',
        cache: true,
        views: {
          'home-tab': {
            templateUrl: 'app/templates/views/home.html',
            controller: 'HomeController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.pro-chart-detail', {
        url: '/chart-detail',
        cache: true,
        views: {
          'home-tab': {
            templateUrl: 'app/templates/views/chart-detail.html',
            controller: 'KlineController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.spot-chart-detail', {
        url: '/chart-detail',
        cache: true,
        views: {
          'home-tab': {
            templateUrl: 'app/templates/views/chart-detail.html',
            controller: 'KlineController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"BTCCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.pro-trade-tab', {
        url: '/trade-tab',
        cache: true,
        views: {
          'pro-trade-tab': {
            templateUrl: 'app/templates/views/trade-tab.html',
            controller:'tradeTabController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.pro-trade-tab.trade', {
        url: '/trade',
        cache: true,
        views: {
          'trade-tab': {
            templateUrl: 'app/templates/views/trade.html',
            controller: 'tradeController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.pro-trade-tab.pending-orders', {
        url: '/pending-orders',
        cache: true,
        views: {
          'pending-tab': {
            templateUrl: 'app/templates/views/pending-orders.html',
            controller: 'pendingOrdersController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.account', {
        url: '/account',
        cache: true,
        views: {
          'account-tab': {
            templateUrl: 'app/templates/views/account.html',
            controller: 'AccountController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
            symbol:"XBTCNY",
            bpi:"BPICNY",
            quantity: 1,
            price: 0.1,
            theme:"default"
        }
      })
      .state('app.tabs.account-detail', {
        url: '/account-detail',
        cache: true,
        views: {
          'account-tab': {
            templateUrl: 'app/templates/views/account-detail.html',
            controller: 'AccountController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
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
        views:{
          'menuContent':{
            templateUrl: 'app/templates/views/login.html',
            controller: 'loginController'
          }
        },
        data:{
            wsurl: constant.cnyWSurl,
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
