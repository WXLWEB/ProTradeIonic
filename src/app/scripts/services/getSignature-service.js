'use strict';
angular.module('ProTradeIonic')
  .factory('getSignature', function (AccountInfo) {
      return function () {
        var joinStr = Array.prototype.join.call(arguments, '');
        var shaObj = new jsSHA(joinStr, "TEXT");
        var hmac = shaObj.getHMAC(AccountInfo.accountKey, "TEXT", "SHA-1", "HEX");
        return hmac;
      };
  });
