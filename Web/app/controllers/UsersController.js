'use strict';
app.controller('UsersController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.authentication = authService.authentication;
    //$scope.UserDetails = [];// 'Deitalyst';
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }

    authService.getUserDetails($scope.authentication.userName).then(function (response) {
        console.log(response);

        $scope.UserDetails = response;
        // console.log($scope.authentication);
    }, function (err) {

    });
    
    

    function activate() {

    }

}]);