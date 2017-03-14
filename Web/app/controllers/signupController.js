'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', 'vcRecaptchaService', 'ngAuthSettings','$http','$q',
    function ($scope, $location, $timeout, authService, vcRecaptchaService, ngAuthSettings, $http, $q) {

        $scope.isBusy = false;
    $scope.response = null;
    $scope.widgetId = null;

    $scope.model = {
        key: '6LcAlg0TAAAAALMrmjkJObWjzJVtGEAfZoZtrWwb'
    };

    $scope.setResponse = function (response) {
        console.info('Response available');

        $scope.response = response;
    };

    $scope.setWidgetId = function (widgetId) {
       // console.info('Created widget ID: %s', widgetId);

        $scope.widgetId = widgetId;
    };

    $scope.cbExpiration = function () {
        //console.info('Captcha expired. Resetting response object');

        $scope.response = null;
    };




    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: ""
    };




    $scope.signUp = function () {
        $scope.isBusy = !$scope.isBusy;
        var valid;
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var deferred = $q.defer();
        //for recaptcha function

        console.log('sending the captcha response to the server', $scope.response);
        //authService.verifyCaptcha($scope.response).then(function (response) {
        //    console.log(response);
        //});

        //$http.post(serviceBase + 'api/account/VerifyCaptcha?responses=' + $scope.response).success(function (response) {
        //    if (response.success == true) {

                authService.saveRegistration($scope.registration).then(function (response) {
                    $scope.isBusy = $scope.isBusy;
                    $scope.savedSuccessfully = true;
                    $scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
                    startTimer();
                }, function (err) {
                   
                    var errors = [];
                    for (var key in err.data.modelState) {
                        for (var i = 0; i < err.data.modelState[key].length; i++) {
                            errors.push(err.data.modelState[key][i]);
                        }
                    }
                    console.log(err);
                    $scope.message = "Failed to register user due to: " + errors.join(' ');
                    $scope.isBusy = !$scope.isBusy;
                });
            //    deferred.resolve(response);

            //   // console.log('true')
            //} else {
            //    $scope.message = "Failed to register user due to reCaptcha not verified";
            //   // console.log('false')
            //}
           // console.log(response);
           

        //}).error(function (err, status) {
        //    vcRecaptchaService.reload($scope.widgetId);
        //    console.log(status);
        //    deferred.reject(err);
        //});


        //if (valid) {
        
        //    console.log('Success');
        //} else {
        //    console.log('Failed validation');

            // In case of a failed validation you need to reload the captcha
            // because each response can be checked just once
           // vcRecaptchaService.reload($scope.widgetId);
        //}
       
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

}]);