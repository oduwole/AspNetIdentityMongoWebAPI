'use strict';
app.controller('confirmEmailController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'browser', function ($scope, $location, authService, ngAuthSettings, browser) {

    $scope.orders = [];
    console.log(browser);
    $scope.confirmMail = {
        code: "",
        userId:""
    }
    var code = $location.search().code;
    var userId = $location.search().userId;
    if (code != null || userId != null) {
        authService.confirmEmail($scope.confirmMail).then(function (results) {

            $scope.orders = results.data;

        }, function (error) {
            //alert(error.data.message);
        });
    } else {
        alert("invalid credentials")
    }
   

}]);