'use strict';
app.controller('settingsController', ['$scope', 'dashboardService', 'browser', 'modalService', '$log', function ($scope, dashboardService, browser, modalService, $log) {
    $scope.animationsEnabled = true;

    function activate() {

    }

    $scope.openAddDeductionModal = function () {

        var custName = 'Oduwole Oluwasegun';
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/views/modal.html'
            //templateUrl: 'myModalContent.html'
        };
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Add',
            headerText: 'Add/Deduct to/from Staff ',// + custName + '?',
            bodyText: ''
        };
        modalService.show(modalDefaults, modalOptions).then(function (result) {


        });

    }
}]);