'use strict';
app.factory('datasetsService', ['$http','$q', 'ngAuthSettings', function ($http,$q, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    //var _datSets = {
    //    provider: "",
    //    Name :"",
    //    FileUrl :"",
    //    Category:"",
    //    Description:"",
    //    UploadedDate:"",
    //    isDeleted:"",
    //    IsDataOpen:"",
    //    isPromoOn:"",
    //    Price:"",
    //    PromoPrice:"",
    //    TransactionID:"",
    //    Organization:"",
    //    ApprovalStatus:""
    //};



    var datasetsServiceFactory = {};

    var _dataSetInfoSave = function (_dataSets,user) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/datasets?user='+user, _dataSets).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    var _editDatasetApproval = function (transid, status) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/datasets/EditDatasetApproval?id=' + transid+'&status='+status).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    }
    

    var _getCategoriesList = function () {
        return $http.get(serviceBase + 'api/categories').then(function (results) {
            return results;
        });
    };
    
    var _downloadDataSet = function (user, filename) {
        return $http.get(serviceBase + 'filestreaming/download?user=' + user + '&filename=' + filename).then(function (results) {
            return results;
        });
    }

    var _getDatasetPathFromTId = function (transid) {
        return $http.get(serviceBase + 'api/datasets/GetDatasetPathFromTId?transid='+transid).then(function (results) {
            return results;
        });
    }; 

    var _getDatasetsList = function () {
        return $http.get(serviceBase + 'api/datasets').then(function (results) {
            return results;
        });
    };
    var _getDatasetById = function (id) {
        return $http.get(serviceBase + 'api/datasets/GetDatasetById?id='+id).then(function (results) {
            return results;
        });
    }; 
    var _getDatasetsByStatus = function (status) {
        return $http.get(serviceBase + 'api/datasets/GetDatasetsByStatus?status='+status).then(function (results) {
            return results;
        });
    };

    var _getUserDatasetsByStatus = function (user,status) {
        return $http.get(serviceBase + 'api/datasets/GetUserDatasetsByStatus?user='+ user + '&status=' + status).then(function (results) {
            return results;
        });
    };

    var _getDatasetsBySearch = function (query) {
        return $http.get(serviceBase + 'api/datasets/GetDatasetsBySearch?query=' + query).then(function (results) {
            return results;
        });
    }; 
    
    var _getOrganizationDatasets = function (user) {
        return $http.get(serviceBase + 'api/datasets/GetOrganizationDatasets?user=' + user).then(function (results) {
            return results;
        });
    };
    
    var _addCategory = function (category) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/categories?category='+category, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    datasetsServiceFactory.getCategoriesList = _getCategoriesList;
    datasetsServiceFactory.addCategory = _addCategory;
    datasetsServiceFactory.dataSetInfoSave = _dataSetInfoSave;
    datasetsServiceFactory.getDatasetsByStatus = _getDatasetsByStatus;
    datasetsServiceFactory.getUserDatasetsByStatus = _getUserDatasetsByStatus;
    
    datasetsServiceFactory.getDatasetsList = _getDatasetsList;
    datasetsServiceFactory.getDatasetById = _getDatasetById;
    datasetsServiceFactory.getOrganizationDatasets = _getOrganizationDatasets;
    datasetsServiceFactory.getDatasetsBySearch = _getDatasetsBySearch;
    datasetsServiceFactory.editDatasetApproval = _editDatasetApproval;
    datasetsServiceFactory.downloadDataSet = _downloadDataSet;
    datasetsServiceFactory.getDatasetPathFromTId = _getDatasetPathFromTId

    return datasetsServiceFactory;

}]);