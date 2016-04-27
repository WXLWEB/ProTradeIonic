'use strict';

/**
 * @ngdoc constant
 * @name ProTradeIonic.API_ENDPOINT
 * @description
 * # API_ENDPOINT
 * Defines the API endpoint where our resources will make requests against.
 * Is used inside /services/ApiService.js to generate correct endpoint dynamically
 */


angular.module('ProTradeIonic')

  // development
  .constant('API_ENDPOINT', {
    host: 'http://dev.btcc.com',
    port: 300,
    path: '',
    needsAuth: false
  });


  // live example with HTTP Basic Auth
  /*
  .constant('API_ENDPOINT', {
    host: 'http://yourserver.com',
    path: '/api/v2',
    needsAuth: true,
    username: 'whatever',
    password: 'foobar'
  });
  */
