'use strict';
app.factory('transactionsService', ['$http', '$q', 'ngAuthSettings', function ($http, $q, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var transactionsServiceFactory = {};

    var _transactionsSave = function (_transDetails, user) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/transactions/PostUsersTransactions?user=' + user, _transDetails).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    var _getUsersTransactions = function (user) {
        return $http.get(serviceBase + 'api/transactions/GetUsersTransactions?user=' + user).then(function (results) {
            return results;
        });
    };

    var _clientIp=function () {
        return $http.get('http://ipinfo.io/json').then(function (results) {
            return results;
        });
    };


    var _getAllTransactions = function (user) {
        return $http.get(serviceBase + 'api/transactions').then(function (results) {
            return results;
        });
    };


    var _getTransactionsOnOrganization = function (user) {
        return $http.get(serviceBase + 'api/transactions/GetTransactionsOnOrganization?user=' + user).then(function (results) {
            return results;
        });
    };

    

    
    transactionsServiceFactory.transactionsSave = _transactionsSave;
    transactionsServiceFactory.getUsersTransactions = _getUsersTransactions;
    transactionsServiceFactory.getTransactionsOnOrganization = _getTransactionsOnOrganization;
    transactionsServiceFactory.getAllTransactions = _getAllTransactions;
    transactionsServiceFactory.clientIp = _clientIp;

    return transactionsServiceFactory;

}]);