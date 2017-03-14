'use strict';
app.factory('dashboardService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var dashboardServiceFactory = {};

    //var _getOrders = function () {

    //    return $http.get(serviceBase + 'api/orders').then(function (results) {
    //        return results;
    //    });
    //};
    //dashboardServiceFactory.getOrders = _getOrders;

    var _getCategories = function (username) {

        return $http.get(serviceBase + 'api/products/GetCategoryByName?username='+username).then(function (results) {
            return results;
        });
    };

    var _getProductsByName = function (product) {

        return $http.get(serviceBase + 'api/products/GetProductsByName?product=' + product).then(function (results) {
            return results;
        });
    };

    var _getProductsByUser = function (username) {

        return $http.get(serviceBase + 'api/products/GetProductsByUser?username=' + username).then(function (results) {
            return results;
        });
    };

    var _getAdsMesageByUser = function (username) {

        return $http.get(serviceBase + 'api/AdsMessages/GetAdsMesageByUser?user=' + username).then(function (results) {
            return results;
        });
    };

    var _addProductsByUser = function (categoryName,productName,username) {
        return $http.post(serviceBase + 'api/products/AddProduct?categoryName=' + categoryName + '&productName=' + productName + '&UserName=' + username).then(function (results) {
            return results;
        });
    };
    
    var _addCategoryByUser = function (categories, UserId, username) {
        return $http.post(serviceBase + 'api/products/AddCategory?categories=' + categories + '&UserId=' + UserId + '&UserName=' + username).then(function (results) {
            return results;
        });
    };

    var _addMessageByUser = function (product,message,user,duration,dlocation,start,end) {
        return $http.post(serviceBase + 'api/AdsMessages/AddMessageByUser?product=' + product + '&message=' + message + '&user=' + user + '&duration=' + duration + '&location=' + dlocation + '&start=' + start + '&end=' + end).then(function (results) {
            return results;
        });
    };

    var _getUserProfile = function (username) {

        return $http.get(serviceBase + 'api/Account/GetUserProfile?username=' + username).then(function (results) {
            return results;
        });
    };

    dashboardServiceFactory.getCategories = _getCategories;
    dashboardServiceFactory.getProductsByName = _getProductsByName;
    dashboardServiceFactory.getProductsByUser = _getProductsByUser;
    dashboardServiceFactory.getAdsMesageByUser = _getAdsMesageByUser;
    dashboardServiceFactory.addProductsByUser = _addProductsByUser;
    dashboardServiceFactory.addCategoryByUser = _addCategoryByUser;
    dashboardServiceFactory.addMessageByUser = _addMessageByUser;
    dashboardServiceFactory.getUserProfile = _getUserProfile;

    return dashboardServiceFactory;

}]);