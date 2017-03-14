'use strict';
app.controller('refreshController', ['$scope', '$location', 'authService', 'localStorageService', function ($scope, $location, authService, localStorageService) {
    var authData = localStorageService.get('authorizationData');
    console.log(authData);
    var decryptToken = CryptoJS.AES.decrypt(authData.token, 'password')
                                  .toString(CryptoJS.enc.Latin1);
    console.log(authData.token)
    console.log(decryptToken)
    $scope.authentication = authService.authentication;
    $scope.tokenRefreshed = false;
    $scope.tokenResponse = null;

    $scope.refreshToken = function () {
        //var authentication = authService.authentication;
        //var encyp = authentication.userName
        //var encrypt = CryptoJS.AES.encrypt(encyp, 'password');
        //var decrypted = CryptoJS.AES.decrypt(encrypt, 'password')
        //                          .toString(CryptoJS.enc.Latin1);

        //alert(encyp + ' converted to ' + encrypt.toString() + '\n' + ' ' + encrypt.toString() + ' converted to ' + decrypted);

        authService.refreshToken().then(function (response) {
            $scope.tokenRefreshed = true;
            $scope.tokenResponse = response;
        },
         function (err) {
             $location.path('/login');
         });
    };

}]);