/**
 * @module app/filter/toArray
 * @desc object to array
 * <pre>
 *   beacause angular orderBy-filter don't support object, so this filter will transform object
 *   to array.
 * </pre>
 */

 'use strict'
 angular.module('ProTradeIonic')
   .filter("toArray", function () {
      return function (obj) {
          var result = [];
          angular.forEach(obj, function (val, key) {
              result.push(val);
          });
          return result;
      };
  });
