(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .constant('constant', {
        domain: 'btcc.com',
        cnyWSurl: 'wss://pro-ws-staging.btcc.com:2012',
        usdWSurl: 'wss://pro-ws-staging.btcc.com:2022',
        weburl: 'https://pro.btcc.com',
        apiurl: 'https://api-staging.btcc.com',
        udfurl: 'https://pro-data-staging.'+ 'btcc.com/data/udf',
        debug: true,
        realLogin: true,
        orderbookCount: "30",
        systemNotice:false,
        systemNoticeKey:"HEADER.MAINTENANCE",
        marketServer:true,
        defaultSymbol:"XBTCNY"
    }
  );

})();
