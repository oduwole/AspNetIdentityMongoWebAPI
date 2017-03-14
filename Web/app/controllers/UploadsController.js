'use strict';
var controllerId = 'UploadsController';
app.controller(controllerId, ['common', '$scope', '$location', 'authService', 'ngAuthSettings', 'Upload', 'datasetsService',
    function (common, $scope, $location, authService, ngAuthSettings, Upload, datasetsService) {
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logSuccess = getLogFn(controllerId, 'success');
    var logError = getLogFn(controllerId, 'error');
    log('Activated Upload View');
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    $scope.authentication = authService.authentication;
    $scope.isBusy = false;
    $scope.category = [];
    $scope.myDatasets = [];

    $scope.datSets = {
        Name: "",
        FileUrl: "",
        Category: "",
        Description: "",
        UploadedDate: "",
        isDeleted: false,
        IsDataOpen: true,
        isPromoOn: false,
        Price: 0,
        PromoPrice: 0,
        TransactionID: "",
        Organization: authService.authentication.userName,
        ApprovalStatus: false
    };

    datasetsService.getCategoriesList().then(function (response) {
        $scope.category = response.data;
    }, function (err) {

    });

    datasetsService.getOrganizationDatasets(authService.authentication.userName).then(function (response) {
        $scope.myDatasets = response.data;
    }, function (err) {

    });

    datasetsService.getUserDatasetsByStatus(authService.authentication.userName, true).then(function (response) {
        $scope.myDatasetsApproved = response.data;
    }, function (err) {

    });

    datasetsService.getUserDatasetsByStatus(authService.authentication.userName, false).then(function (response) {
        $scope.myDatasetsUnapproved = response.data;
    }, function (err) {

    });

    function activate() {

    }

    $scope.$watch('files', function () {

        $scope.upload($scope.files);
    });

    //$scope.upload = function (files) {
        
    //    console.log($scope.datSets)
    //}

    $scope.upload = function (files) {
        
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var size = file.size;
                    
                    Upload.upload({
                        //url: serviceBase + 'api/uploadfile/UploadItem?user=' + $scope.authentication.userName,//'UploadsHandler.ashx', 
                       // url: serviceBase + 'filestreaming/upload?overWrite=false',//'UploadsHandler.ashx', 
                        url: serviceBase + 'api/uploadfile/PostProfileImage?manager=' + $scope.authentication.userName,//'UploadsHandler.ashx', 
                        fields: {
                            'user': $scope.authentication.userName//$scope.username
                        },
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.logg = '';
                        $scope.datSets.FileUrl ='uploads/'+$scope.authentication.userName+'/'+ evt.config.file.name;
                        $scope.logg = progressPercentage*size / (100*1048576) + ' MB progress: ' + progressPercentage + '% ' +
                                    evt.config.file.name + '\n' + $scope.logg;
                        
                    }).success(function (data, status, headers, config) {
                        $scope.isBusy = !$scope.isBusy;
                        datasetsService.dataSetInfoSave($scope.datSets, $scope.authentication.userName).then(function (response) {
                            console.log($scope.datSets)
                           // $scope.isBusy = $scope.isBusy;
                            
                        },function (err) {
                             $scope.isBusy = !$scope.isBusy;
                             console.log(err);
                             $scope.message = err.error_description;
                         }
                         );


                        log(config.file.name + ' uploaded successfully');
                        $scope.logg = 'file ' + config.file.name + ' uploaded. Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        //$scope.$apply();
                    }).error(function (data, status, headers, config) {
                        console.log($scope.datSets)
                        log('error uploading item');
                    });
                }
            }
        };

}]);