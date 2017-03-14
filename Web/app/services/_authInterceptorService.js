'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {//,'$cookieStore'   , $cookieStore

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
       
        var authData = localStorageService.get('authorizationData');
        //alert(authData);
        console.log(authData);
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    //var _response = function (response) {
    //    return {
    //        response: function (response) {
    //            return promise.then(
    //              function success(response) {
    //                  return response;
    //              },
    //            function error(response) {
    //                if (response.status === 401) {
    //                    $location.path('/login');
    //                    return $q.reject(response);
    //                }
    //                else {
    //                    return $q.reject(response);
    //                }
    //            });
    //        }
    //    }
    //}

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    $location.path('/refresh');
                    return $q.reject(rejection);
                }
            }
            authService.logOut();
            $location.path('/login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
   // authInterceptorServiceFactory.response = _response;

    return authInterceptorServiceFactory;
}]);