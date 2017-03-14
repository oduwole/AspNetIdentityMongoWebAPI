'use strict';
var controllerId = 'dashboardController';
//app.controller('dashboardController', ['$scope', 'dashboardService', 'browser', ' $modal', '$log', function ($scope, dashboardService, browser, $modal, $log) {
app.controller(controllerId, ['common', '$scope', 'authService', 'dashboardService','datasetsService','transactionsService', 'browser', 'modalService', '$log', '$filter','$location',
    function (common, $scope, authService, dashboardService, datasetsService,transactionsService, browser, modalService, $log, $filter, $location) {
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logSuccess = getLogFn(controllerId, 'success');
    var logError = getLogFn(controllerId, 'error');
    log('Activated Dashboard View');
    

    $scope.sortReverse = false;  // set the default sort order
    $scope.animationsEnabled = true;
    $scope.category = '';
    $scope.product = '';
    $scope.adsMessage = '';
    $scope.authentication = authService.authentication;
    $scope.dataSets = 0;
    $scope.pendindApprovedDatasets = 0;
    $scope.ApprovedDatasets = 0;
    $scope.Sold = 0;

    //authService.hasRole($scope.authentication.userName, 'Merchant').then(function (results) {
    //    if (results == false) {
    //        $location.path('error404');
    //    }
    //    console.log(results);
    //    $scope.orders = results.data;

    //}, function (error) {
    //    console.log(error);
    //    //alert(error.data.message);
    //});

    activate();

    function activate() {
       
    }

    datasetsService.getOrganizationDatasets(authService.authentication.userName).then(function (response) {
        $scope.dataSets = response.data.length;
    }, function (err) {

    });

    datasetsService.getUserDatasetsByStatus(authService.authentication.userName, true).then(function (response) {
        $scope.ApprovedDatasets = response.data.length;
    }, function (err) {

    });

    datasetsService.getUserDatasetsByStatus(authService.authentication.userName, false).then(function (response) {
        $scope.pendindApprovedDatasets = response.data.length;
    }, function (err) {

    });

    transactionsService.getTransactionsOnOrganization(authService.authentication.userName).then(function (response) {
        $scope.Sold = response.data.length;
        $scope.SoldDetails = response.data;
    }, function (err) {

    });

    $scope.refresh = function () {
        activate();
        log('data refreshed');
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

    $scope.openCreateCategoryModal = function () {

        var custName = 'Oduwole Oluwasegun';
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/views/modal/createcategory.html'
            //templateUrl: 'myModalContent.html'
        };
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Add',
            headerText: 'Create Campaign',// + custName + '?',
            bodyText: ''
        };
        modalService.show(modalDefaults, modalOptions).then(function (result) {
            var catVal = $('#txtCategory').val();
            dashboardService.addCategoryByUser(catVal, $scope.authentication.userName, $scope.authentication.userName).then(function (response) {
                logSuccess(catVal +' added successfully');
                //console.log(response.data);
                $scope.category.push({ 'id': '1', 'categoryName': catVal, 'transactionDate': new Date().toUTCString()});
               // $scope.product = response.data;
            },
       function (err) {
           logError('error adding campaigns');
           console.log(err);
           $scope.message = err.error_description;
       }
       );
            

        });

    }
   
    $scope.openCreateProductsModal = function () {
        var categor = $scope.category;
        var custName = 'Oduwole Oluwasegun';
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/views/modal/createproducts.html'
            //templateUrl: 'myModalContent.html'
        };
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Add',
            headerText: 'Create Products',// + custName + '?',
            bodyText: '',
            category:categor
        };
        modalService.show(modalDefaults, modalOptions).then(function (result) {
            var ic = $scope.category;
            var catVal = $('#lvCategoryName').find(":selected").text();
            var txtCategory = $('#txtCategoryP').val();
            var result = $filter('filter')(ic, { categoryName: catVal })[0];
            dashboardService.addProductsByUser(catVal, txtCategory,  $scope.authentication.userName).then(function (response) {
                logSuccess(catVal +' added successfully');
                console.log(response.data);
                $scope.product.push({ 'id': '1', 'productName': catVal, 'categoryName': txtCategory, 'transactionDate': new Date().toUTCString() });
                //$scope.product = response.data;
            },
      function (err) {
          logError('error adding adsense');
          console.log(err);
          $scope.message = err.error_description;
      }
      );

        });


    }

    $scope.openCreateAdMessageModal = function () {
        var produce = $scope.product;
        var custName = 'Oduwole Oluwasegun';
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/views/modal/createAdMessage.html'
            //templateUrl: 'myModalContent.html'
        };
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Add',
            headerText: 'Create Ads Message',// + custName + '?',
            bodyText: '',
            category: produce
        };
        modalService.show(modalDefaults, modalOptions).then(function (result) {
            var ic = $scope.produce;
            var prodVal = $('#lvProdName').find(":selected").text();
            var txtMessage = $('#txtCampMessage').val();
            var txtLocation = $('#txtLocation').val();
            var txtstartDate = $('#startDate').val();
            var txtendDate = $('#endDate').val();
            //var result = $filter('filter')(ic, { categoryName: catVal })[0];
            console.log(txtLocation);
            console.log(txtstartDate);
            console.log(txtMessage);
            console.log(txtendDate);


            dashboardService.addMessageByUser(prodVal, txtMessage, $scope.authentication.userName, 20, txtLocation, txtstartDate, txtendDate).then(function (response) {
                console.log(response.data);
                logSuccess(prodVal + ' added successfully');
                //$scope.category.push({ 'id': '1', 'productName': catVal, 'categoryName': txtCategory, 'transactionDate': new Date().toUTCString() });
                //$scope.product = response.data;
            },
      function (err) {
          logError('error adding message');
          console.log(err);
          $scope.message = err.error_description;
      }
      );

        });


    }
    
    function ides(ic, catVal) {
        var i = null;
        for (i = 0; ic.length < i; i++) {
            if (ic[i].categoryName == catVal) {
                return ic[i].id;
            }
        }
        //return JSON.search(value)
    }
  
}]);

