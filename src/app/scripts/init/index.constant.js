(function() {
  'use strict';

  angular
    .module('ProTradeIonic')
    .constant('constant', {
        domain: 'btcc.com',
        cnyWSurl: 'wss://pro-ws.btcc.com:2012',
        usdWSurl: 'wss://pro-ws.btcc.com:2022',
        weburl: 'https://pro.btcc.com',
        apiurl: 'https://api.btcc.com',
        udfurl: 'https://pro-data-staging.'+ 'btcc.com/data/udf',
        debug: true,
        realLogin: true,
        orderbookCount: "30",
        testAccount: {"account":{"id":"1013","account_type":"mainland_china","account_permission":"31","username":"tommy","email":"tommy@gmail.com","lang":"zh","mobile_wallet_tos":false,"mobile_country_code":"CN","mobile":"","mobile_verified":false,"mobile_pin_set":false,"transaction_password_set":false,"otp_set":false,"security_questions_set":false,"user_identification_set":false,"has_twofactory":false,"twofactory_trade":0,"twofactory_withdraw":0,"twofactory_login":0,"disable_txpassword_trade":0,"name":"","id_number":"","id_number_status":0,"id_type":0,"id_type_other":"","has_withdraw_bank":false,"count_mobile_bind_ids":0,"login_password_level":1,"justpay_account_type":0,"merchant_flag":0,"account_key":"d7e6b3a2-bf01-4395-b16e-b28760db1583"},"exchange":{"trade_fee_cnybtc":0,"trade_fee_cnyltc":0,"trade_fee_btcltc":0,"daily_btc_limit":10,"daily_ltc_limit":300},"wallet":{"atm_seller_fee":0.5,"atm_enabled":false}},
        systemNotice:false,
        systemNoticeKey:"HEADER.MAINTENANCE",
        marketServer:true,
        defaultSymbol:"XBTCNY"
    }
  );

})();
