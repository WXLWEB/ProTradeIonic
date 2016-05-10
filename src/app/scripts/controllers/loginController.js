'use strict'
angular.module('ProTradeIonic')
  .controller('loginController',function($rootScope, $scope, $http, base64, $log, constant, Session, authService, $ionicHistory, $state) {
    Session.login();
    $scope.usernameTitle = false;
    $scope.userPasswordTitle = false;
    $scope.showLoginSpinner = false;
    $scope.showCaptcha = false;
    $scope.loging = false;

    $scope.user =  {
        username :'',
        password :'',
        captcha:'',
        pin:''
    };
    $scope.digital = new RegExp("[0-9]*");

    $scope.$on('loginSuccess',function() {
      $state.go('app.account');
      $ionicHistory.goBack();
    })

    $scope.login = function (user) {
      $log.debug('User:',user);
      $log.debug('Form:',$scope.formLogin);
        $scope.$emit('startLoginCheck');
        $scope.showLoginSpinner = true;
        $scope.loging = true;
        $http({
          url: constant.apiurl+'/api.php/account/authenticate',
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + base64.encode(user.username + ":" + user.password),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
            data: $.param({
                'captcha': user.captcha,
                'twofactorpwd': user.pin,
                /*
                 * MS IE 10 bug
                 * response.status is always 0 instead of 401 when the Server returns Authorization Required and you're doing CORS in IE10 on Windows 7.
                 * see https://connect.microsoft.com/IE/feedback/details/785990/ie-10-on-win8-does-not-assign-the-correct-status-to-xmlhttprequest-when-the-result-is-401
                 * do not want user to set IE settings, told php return 402 instead 401
                 */
                'msie10': /msie 10/.test(navigator.userAgent.toLowerCase())
            })
        }).then(function(success){
           $scope.logined = true;
           $scope.invalidUser = false;
           $scope.userLocked = false;
           $scope.user.captcha = '';
           $scope.loging = false;
           Session.login();
           $log.debug('login sport success');
        }, function(error) {
            $scope.loging = false;
            $scope.$emit('cancelLoginCheck');
            $scope.showLoginSpinner = false;
            var data = error.data;
          if(data == "-32082") { // need captcha
              if($scope.showCaptcha) {
                  $scope.wrongCaptcha = true;
                  $scope.needCaptcha = false;
              } else {
                  $scope.needCaptcha = true;
                  $scope.wrongCaptcha = false;
              }
              $scope.refreshCaptcha();
              $scope.showCaptcha = true;
              $scope.invalidUser = false;
          } else if(data == '-32099') { // wrong gaCode
              if(!$scope.showGaCode) {
                  $scope.showGaCode = true;
                  $modalInstance.close();
                  $scope.animationsEnabled = true;
                  var openCheckLogin = function (size) {
                      var modalInstance = $modal.open({
                          animation: $scope.animationsEnabled,
                          templateUrl: 'twofactor/googleauth.html',
                          controller: 'googleAuthCtrl',
                          size: size,
                          backdrop:false,
                          resolve: {
                              user: function () {
                                  return $scope.user;
                              }
                          }
                      });
                  };
                  openCheckLogin('googleAuth');
              } else {
                  $scope.wrongGaCode = true;
              }
          } else if(data == '-32085') { // user locked temp
              $scope.userLocked = true;
          } else if(data == '-32110') { // user locked forever
              $scope.lockedForever = true;
          } else if(data == '-32047') { // multi times wrong
              $scope.invalidUser = true;
              $scope.refreshCaptcha();
              $scope.showCaptcha = true;
          } else {
              // wrong username or password
              $scope.invalidUser = true;
              $scope.showCaptcha = false;
              $scope.refreshCaptcha();
          }
        });
    };

    $rootScope.$on('loginSuccess', function () {
        $scope.$emit('cancelLoginCheck');
        $rootScope.$broadcast('startEPANoteCheck');
    });

    $scope.usernameChanged = function() {
        $scope.invalidUser = false;
        $scope.showCaptcha = false;
        $scope.wrongCaptcha = false;
        $scope.needCaptcha = false;
    };

    $scope.captchaChanged = function() {
        $scope.wrongCaptcha = false;
        $scope.needCaptcha = false;
    };

    $scope.refreshCaptcha = function() {
        $scope.captchaUrl = constant.apiurl+'/api.php/account/captcha?username=' + encodeURIComponent($scope.user.username) + '&rand=' + Math.random();
        $scope.user.captcha = '';
    };
  });
