/**
 * @module app/service/getUniqueID
 * @desc generate a client order id
 * <pre>
 *   Actually, I just copy this function from hkfe's demo code
 * <pre>
 */
 angular.module('ProTradeIonic')
  .factory('getUniqueID', function () {
    return function () {
      // always start with a letter (for DOM friendlyness)
      var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
      do {
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode = Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64) {
          // exclude all chars between : (58) and @ (64)
          idstr += String.fromCharCode(ascicode);
        }
      } while (idstr.length < 32);
      return idstr;
    };
  });
