'use strict';
app.controller('ordersController', ['$scope', 'ordersService','browser', function ($scope, ordersService,browser) {

    $scope.orders = [];
    console.log(browser);
    ordersService.getOrders().then(function (results) {

        $scope.orders = results.data;

    }, function (error) {
        //alert(error.data.message);
    });

}]);