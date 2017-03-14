var app = angular.module('damorel', ['ngRoute', 'ngCookies',
    'LocalStorageModule',
    'angular-loading-bar',
    //'ngAnimate',
    'common',
    'angularjs-crypto',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ngMessages',
    'vButton',
    'vcRecaptcha',
    'ngTagsInput',
    'ngFileUpload',
    '720kb.downloader', //downloader module
    'angular-tour'
]);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when("/", {
        controller: "homeController",
        templateUrl: "./app/views/home.html"
    });

    $routeProvider.when("/merchant/:home", {
        controller: "homeController",
        templateUrl: "./app/views/home.html"
    });
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "./app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html"
    });

    $routeProvider.when("/register", {
        controller: "loginController",
        templateUrl: "app/views/register.html"
    });

    $routeProvider.when("/contact", {
        controller: "loginController",
        templateUrl: "app/views/contact.html"
    });

    $routeProvider.when("/category", {
        controller: "loginController",
        templateUrl: "app/views/categories.html"
    });

    $routeProvider.when("/forgotpassword", {
        controller: "loginController",
        templateUrl: "app/views/forgotpassword.html"
    });
    $routeProvider.when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "app/views/dashboard.html"
    });

    $routeProvider.when("/resetpassword", {
        controller: "loginController",
        templateUrl: "app/views/ResetPassword.html"
    });
    $routeProvider.when("/confirmemail", {
        controller: "confirmEmailController",
        templateUrl: "app/views/confirmemailregistration.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "app/views/order.html"
    });

    $routeProvider.when("/orders-view", {
        controller: "ordersController",
        templateUrl: "app/views/myorder.html"
    });

    $routeProvider.when("/settings", {
        controller: "ordersController",
        templateUrl: "app/views/settings.html"
    });
    $routeProvider.when("/account", {
        controller: "accountsController",
        templateUrl: "app/views/accounts.html"
    });
    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "app/views/associate.html"
    });

    $routeProvider.when("/adm_setup", {
        controller: "AdminController",
        templateUrl: "app/views/adm_setup.html"
    });

    $routeProvider.when("/adm_approvals", {
        controller: "AdminController",
        templateUrl: "app/views/adm_approvals.html"
    });

    $routeProvider.when("/datasets", {
        controller: "UploadsController",
        templateUrl: "app/views/datasets.html"
    });

    $routeProvider.when("/infographics", {
        controller: "UploadsController",
        templateUrl: "app/views/infographics.html"
    });

    $routeProvider.when("/UserProfile", {
        controller: "UsersController",
        templateUrl: "app/views/UsersProfile.html"
    });

    $routeProvider.when("/Settings", {
        controller: "UsersController",
        templateUrl: "app/views/Settings.html"
    });

    $routeProvider.when("/blog", {
        controller: "homeController",
        templateUrl: "app/views/blog.html"
    });

    $routeProvider.when("/blogpost", {
        controller: "homeController",
        templateUrl: "app/views/blogpost.html"
    });

    /*$routeProvider.when('/store', {
        templateUrl: 'app/views/shoppingCart/store.htm',
        controller: "storeController"
    });*/

    $routeProvider.when('/store', {
        templateUrl: 'app/views/products.html',
        controller: "storeController"
    });

    $routeProvider.when('/products/:productSku', {
        templateUrl: 'app/views/shoppingCart/product.htm',
        controller: "storeController"
    });

    $routeProvider.when('/_cart', {
        templateUrl: 'app/views/shoppingCart/shoppingCart.htm',
        controller: "storeController"
    });
    $routeProvider.when('/cart', {
        templateUrl: 'app/views/shoppingCart/basket.html',
        controller: "storeController"
    });

    $routeProvider.when('/details', {
        templateUrl: 'app/views/details.html',
        controller: "indexController"
    });

    $routeProvider.when('/checkout', {
        templateUrl: 'app/views/ShoppingCart/checkout.html',
        controller: "storeController"
    });

    $routeProvider.when('/viewDataDetails', {
        templateUrl: 'app/views/dataDetails.html',
        controller: "homeController"
    });

    $routeProvider.when("/metrics", {
        controller: "AdminController",
        templateUrl: "app/views/metrics.html"
    });

    $routeProvider.when("/error404", {
        controller: "error404",
        templateUrl: "app/views/error404.html"
    });

    //$routeProvider.otherwise({ redirectTo: "/home" });
    $routeProvider.otherwise({
        redirectTo: "/error404"
    });
    /*$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});*/
    //  $locationProvider.html5Mode(true);

});






//$('#side-menu').metisMenu();

//$('#mainNav').affix({
//    offset: {
//        top: 100
//    }
//})


//var serviceBase = 'http://localhost:26264/';
var serviceBase = 'http://localhost:8011/API/';
//var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
//var serviceBase = 'http://deitalystapi.azurewebsites.net/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
    $httpProvider.defaults.useXDomain = true;

    $httpProvider.defaults.headers.get = {
        'Access-Control-Allow-Origin': '*'
    };
    $httpProvider.defaults.headers.get = {
        'Access-Control-Request-Headers': 'X-Requested-With, accept, content-type'
    };
    $httpProvider.defaults.headers.get = {
        'Access-Control-Allow-Methods': 'GET, POST'
    };
    $httpProvider.defaults.headers.get = {
        'dataType': 'jsonp'
    };

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.run(['authService', function(authService) {
    authService.fillAuthData();
}]);

toastr.options.timeOut = 4000;
toastr.options.positionClass = 'toast-bottom-right';

app.config(['$logProvider', function($logProvider) {
    // turn debugging off/on (no info or warn)
    if ($logProvider.debugEnabled) {
        $logProvider.debugEnabled(true);
    }
}]);

app.run(function(cfCryptoHttpInterceptor, $rootScope) {
    //var key = "16rdKQfqN3L4TY7YktgxBw==";
    $rootScope.base64Key = "16rdKQfqN3L4TY7YktgxBw==";
    cfCryptoHttpInterceptor.base64Key = $rootScope.base64Key;
    cfCryptoHttpInterceptor.pattern = "_enc"; //default value but for a better understanding it is also defined here
    cfCryptoHttpInterceptor.plugin = new CryptoJSCipher(CryptoJS.mode.ECB, CryptoJS.pad.Pkcs7, CryptoJS.TripleDES)
});

var config = {
    appErrorPrefix: '[HT Error] ', //Configure the exceptionHandler decorator
    docTitle: 'HotTowel: ',
    //events: events,
    //remoteServiceName: remoteServiceName,
    version: '2.1.0'
};

app.value('config', config);

app.config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', 'config', 'logger', extendExceptionHandler]);
}]);

function extendExceptionHandler($delegate, config, logger) {
    var appErrorPrefix = config.appErrorPrefix;
    var logError = logger.getLogFn('app', 'error');
    return function(exception, cause) {
        $delegate(exception, cause);
        if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) {
            return;
        }

        var errorData = {
            exception: exception,
            cause: cause
        };
        var msg = appErrorPrefix + exception.message;
        logError(msg, errorData, true);
    };
}

//app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
//    cfpLoadingBarProvider.includeSpinner = false;
//}]);