'use strict';
var controllerId = 'accountsController';
app.controller(controllerId, ['common', '$scope', 'dashboardService', 'authService', 'browser', 'modalService', '$log',
    function (common, $scope, dashboardService, authService, browser, modalService, $log) {
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    log('Activated Account View');

    $scope.authentication = authService.authentication;
    $scope.UserDetails = '';

    $scope.animationsEnabled = true;

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

    function activate() {
        getUserProfile();
    }

    function getUserProfile() {
        dashboardService.getUserProfile($scope.authentication.userName).then(function (response) {
            console.log(response.data);
            $scope.UserDetails = response.data;
        },
       function (err) {
           console.log(err);
           $scope.message = err.error_description;
       }
       );
    }

    
}]);