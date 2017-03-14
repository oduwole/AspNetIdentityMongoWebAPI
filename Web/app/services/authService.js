'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false,
        isRootAdmin: false,
        isShopper: false,
        isVendor: false,
        isAdmin:false,
        isMerchant:false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };
    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };

    var _myRoleAccess = function (user) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'api/account/GetUsersRoles?user=' + user).success(function (response) {
            console.log(response);
            //localStorageService.set('roles', { roles: response });
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    
    var _hasRole = function (user, role) {
        var deferred = $q.defer();
        $http.get(serviceBase + 'api/account/HasRole?user=' + user + '&role=' + role).success(function (response) {
            if (role == "Merchant") {
                localStorageService.set('MerchantRoles', { roles: response });
                _authentication.isMerchant = response;
            }
            if (role == "Root") {
                localStorageService.set('RootRoles', { roles: response });
                _authentication.isRootAdmin = response;
            }
            if (role == "Vendors") {
                localStorageService.set('VendorsRoles', { roles: response });
                _authentication.isVendor = response;
            }
            if (role == "Shopper") {
                localStorageService.set('ShopperRoles', { roles: response });
                _authentication.isShopper = response;
            }
            if (role == "Administrator") {
                localStorageService.set('AdministratorRoles', { roles: response });
                _authentication.isAdmin = response;
            }
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    };


    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            //_myRoleAccess(loginData.userName);
            if (loginData.useRefreshTokens) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
            }
            else {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
            }
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _addUser2Role = function (loginData) {
        var deferred = $q.defer();
        var data = loginData;
        $http.post(serviceBase + 'api/account/AddUserToRole?user='+loginData.userName+'&role='+loginData.roles, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _addRole = function (role) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/account/CreateRole?role=' + role, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var _allroles = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + "api/account/GetAllRoles").success(function (response) {
            deffered.resolve(response);
        }).error(function (err, status) {
            deffered.reject(err);
        });
        return deffered.promise;
    }

    var _allrolesList = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + "api/account/GetAllRolesList").success(function (response) {
            deffered.resolve(response);
        }).error(function (err, status) {
            deffered.reject(err);
        });
        return deffered.promise;
    }

    var _allUsersList = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + "api/account/GetAllUsersList").success(function (response) {
            deffered.resolve(response);
        }).error(function (err, status) {
            deffered.reject(err);
        });
        return deffered.promise;
    }

    var _allUsers = function () {
        var deffered = $q.defer();
        $http.get(serviceBase + "api/account/GetAllUsers").success(function (response) {
            deffered.resolve(response);
        }).error(function (err, status) {
            deffered.reject(err);
        });
        return deffered.promise;
    }

    var _getUserDetails = function (user) {
        var deffered = $q.defer();
        $http.get(serviceBase + "api/account/GetUserDetails?user="+user).success(function (response) {
            deffered.resolve(response);
        }).error(function (err, status) {
            deffered.reject(err);
        });
        return deffered.promise;
    }


    var _roles = function (loginData) {
        var deffered = $q.defer();
        $http.get(serviceBase + 'api/account/getroles?user=' + loginData.userName).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deffered.promise;
    };

    var _requestAccountUpgrade = function (user,role) {
        var deffered = $q.defer();
        $http.post(serviceBase + 'api/account/RequestAccountUpgrade?user=' + user+'&role='+role).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deffered.promise;
    };
    
    var _logOut = function () {

        localStorageService.remove('authorizationData');
        //localStorageService.remove('roles');
        localStorageService.remove('RootRoles');
        localStorageService.remove('AdministratorRoles');
        localStorageService.remove('MerchantRoles');
        localStorageService.remove('VendorsRoles');
        localStorageService.remove('ShopperRoles');
        localStorageService.remove('merchant_roles');
        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };


    var _verifyCaptcha = function (response) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/VerifyCaptcha?responses='+response).success(function (response) {

            console.log(response);
            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };
    

    var _forgotPassword = function (email) {
        return $http.post(serviceBase + 'api/account/ForgotPassword', email).then(function (response) {
            return response;
        });
    }

    var _resetPassword = function (details) {
        return $http.post(serviceBase + 'api/account/resetPassword', details).then(function (response) {
            return response;
        });
    }

    var _confirmEmail = function (details) {
        return $http.post(serviceBase + 'api/account/confirmEmail', details).then(function (response) {
            return response;
        });
    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;
    authServiceFactory.verifyCaptcha = _verifyCaptcha;
    authServiceFactory.forgotPassword = _forgotPassword;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.confirmEmail = _confirmEmail;
    authServiceFactory.roles = _roles;
    authServiceFactory.allroles = _allroles;
    authServiceFactory.allrolesList = _allrolesList;
    authServiceFactory.allUsersList = _allUsersList;
    authServiceFactory.allUsers = _allUsers;
    authServiceFactory.addRole = _addRole;
    authServiceFactory.addUser2Role = _addUser2Role;
    authServiceFactory.hasRole = _hasRole;
    authServiceFactory.myRoleAccess = _myRoleAccess;
    authServiceFactory.requestAccountUpgrade = _requestAccountUpgrade;
    authServiceFactory.getUserDetails = _getUserDetails

    return authServiceFactory;
}]);