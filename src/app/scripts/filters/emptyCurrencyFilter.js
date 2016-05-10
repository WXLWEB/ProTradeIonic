'use strict';
angular.module('ProTradeIonic')
  .filter('emptyCurrency',function(){
      return function(value){
          if(_.isUndefined(value) || _.isNaN(value)){
              return '-';
          }
          else{
              return value;
          }
      };
  });
