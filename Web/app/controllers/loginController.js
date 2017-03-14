'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', function($scope, $location, authService, ngAuthSettings) {
    $scope.isBusy = false;

    function activate() {

    }

    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false,
        remember: false
    };

    $scope.forgotPassword = {
        email: ""
    }

    $scope.resetPasswords = {
        email: "",
        password: "",
        confirmpassword: ""
    }

    $scope.message = "";

    $scope.login = function() {
        $scope.isBusy = !$scope.isBusy;
        authService.login($scope.loginData).then(function(response) {
                $scope.isBusy = $scope.isBusy;
                $('#login-modal').modal('hide')
                $location.path('/home');

            },
            function(err) {
                $scope.isBusy = !$scope.isBusy;
                console.log(err);
                $scope.message = err.error_description;
            }
        );
    };



    $scope.forgetpassword = function() {
        authService.forgotPassword($scope.forgotPassword).then(function(response) {

                $location.path('/orders');

            },
            function(err) {
                //$scope.message = err.error_description;
                $scope.message = err.data.message;
            });
    }

    $scope.resetPassword = function() {
        authService.resetPassword($scope.resetPasswords).then(function(response) {

                // $location.path('/orders');

            },
            function(err) {
                //$scope.message = err.error_description;
                $scope.message = err.data.message;
            });
    }

    $scope.authExternalProvider = function(provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
        //var redirectUri = 'http://localhost:8005/Jabolani.Web' + '/authcomplete.html';
        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=" + ngAuthSettings.clientId + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function(fragment) {

        $scope.$apply(function() {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };

                $location.path('/associate');

            } else {
                //Obtain access token and redirect to orders
                var externalData = {
                    provider: fragment.provider,
                    externalAccessToken: fragment.external_access_token
                };
                authService.obtainAccessToken(externalData).then(function(response) {

                        $location.path('/orders');

                    },
                    function(err) {
                        $scope.message = err.error_description;
                    });
            }

        });
    }
}]);