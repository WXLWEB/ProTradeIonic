'use strict';

/**
 * @ngdoc overview
 * @name ProTradeIonic
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('ProTradeIonic', ['ionic', 'ngCordova', 'ngResource'])

  .run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
      // save to use plugins here
    });

    // add possible global event handlers here

  })

  .config(function($httpProvider, $stateProvider, $urlRouterProvider) {
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');

    // Application routing
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainController'
      })
      .state('app.home', {
        url: '/home',
        cache: true,
        views: {
          'home-tab': {
            templateUrl: 'templates/views/home.html',
            controller: 'HomeController'
          }
        }
      })
      .state('app.trade', {
        url: '/trade',
        cache: true,
        views: {
          'trade-tab': {
            templateUrl: 'templates/views/settings.html',
            controller: 'SettingsController'
          }
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
            templateUrl: 'templates/views/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('app.chat-detail', {
        url: '/chats/:chatId',
        cache: true,
        views: {
          'tab-chats': {
            templateUrl: 'templates/views/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('app.account', {
        url: '/account',
        cache: true,
        views: {
          'tab-account': {
            templateUrl: 'templates/views/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/app/home');
  });


