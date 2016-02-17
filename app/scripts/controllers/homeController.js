'use strict';

/**
 * @ngdoc function
 * @name ProTradeIonic.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('ProTradeIonic')
  .controller('HomeController', function($scope, ExampleService) {

    $scope.myHTML = null;

    // just an example...
    //$scope.fetchRandomText = function() {
    //  ExampleService.doSomethingAsync()
    //    .then(ExampleService.fetchSomethingFromServer)
    //    .then(function(response) {
    //        $scope.myHTML = response.data.text;
    //        // close pull to refresh loader
    //        $scope.$broadcast('scroll.refreshComplete');
    //    });
    //};

    //$scope.fetchRandomText();
    var widget = new TradingView.widget({
      fullscreen: true,
      symbol: 'BTCCNY',
      interval: '60',
      container_id: "chart",
      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: new Datafeeds.UDFCompatibleDatafeed("https://pro-data.btcc.com/data/udf"),
      library_path: "charting_library/",
      locale: "en",
      //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
      disabled_features: ["use_localstorage_for_settings"],
      preset: "mobile"
    });
  });
