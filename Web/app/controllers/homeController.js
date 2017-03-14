'use strict';
//'csvServie',
app.controller('homeController', ['$scope', '$location', '$http', '$routeParams', 'authService', 'datasetsService', 'storeService', 'ngAuthSettings', 'localStorageService', '$anchorScroll', 'HelloWorldService',
    function($scope, $location, $http, $routeParams, authService, datasetsService, storeService, ngAuthSettings, localStorageService, $anchorScroll, HelloWorldService) {
        $scope.authentication = authService.authentication;
        $scope.logOut = function() {
            authService.logOut();
            $location.path('/');
        }
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        //$scope.isShopper = false;
        //$scope.isAdmin = false;
        //$scope.isMerchant = false;
        //authService.myRoleAccess($scope.authentication.userName).then(function (response) {
        //    console.log($scope.authentication);
        //},function (err) {

        //});
        //alert(serviceBase);
        //$scope.currentStep = $cookies.get('myTour');
        //if (typeof curStep === 'string')
        //    curStep = parseInt(curStep);

        //$scope.currentStep = curStep || 0;

        //// save cookie after each step
        //$scope.stepComplete = function () {
        //   // ipCookie('myTour', $scope.currentStep, { expires: 3000 });
        //};

        /*console.log(HelloWorldService.doWork({
            from: 1,
            to: 100
        }));*/

        //console.log(HelloWorldService.startWorker());

        $scope.items1 = localStorageService.get('searchData1');
        $scope.dOrg = 'Damorel';
        //$scope.store = storeService.store;
        $scope.cart = storeService.cart;

        $scope.items = localStorageService.get('searchData');

        authService.hasRole($scope.authentication.userName, 'Administrator').then(function(response) {
            console.log(response);
            console.log($scope.authentication.userName);
            $scope.isAdmin = response;
            // console.log($scope.authentication);
        }, function(err) {

        });
        authService.hasRole($scope.authentication.userName, 'Shopper').then(function(response) {
            $scope.isShopper = response;
            console.log(response);
            //console.log($scope.authentication);
        }, function(err) {

        });
        authService.hasRole($scope.authentication.userName, 'Vendors').then(function(response) {
            // console.log($scope.authentication);
        }, function(err) {

        });
        authService.hasRole($scope.authentication.userName, 'Root').then(function(response) {
            // console.log($scope.authentication);
        }, function(err) {

        });
        authService.hasRole($scope.authentication.userName, 'Merchant').then(function(response) {
            $scope.isMerchant = true;
            console.log(response);
            //console.log($scope.authentication);
        }, function(err) {

        });

        if ($location.search().data != null) {
            datasetsService.getDatasetById($location.search().data).then(function(response) {
                console.log(response.data);

                $scope.items1 = response.data;
                localStorageService.set('searchData1', response.data);
            }, function(err) {});
        }

        $scope.searchData = function(me) {
            datasetsService.getDatasetsBySearch(me).then(function(response) {
                console.log(response.data);
                localStorageService.set('searchData', response.data);
                $scope.items = response.data;
            }, function(err) {});
        }

        $scope.txtEnter = function(keyEvent, me) {
            if (keyEvent.which === 13)
                if (me == null) {
                    datasetsService.getDatasetsList().then(function(response) {
                        console.log(response.data);
                        localStorageService.set('searchData', response.data);
                        $scope.items = response.data;
                    }, function(err) {});

                } else {
                    datasetsService.getDatasetsBySearch(me).then(function(response) {
                        console.log(response.data);
                        localStorageService.set('searchData', response.data);
                        $scope.items = response.data;
                    }, function(err) {});
                }
        }

        $scope.gotoAnchor = function(x) {
            var newHash = 'anchor' + x;
            //if ($location.hash() !== newHash) {
            if ($location.hash() !== x) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash('anchor' + x);
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        }

        $scope.downloadStuffFromAjax = function downloadStuffFromAjax() {
            $http({
                'method': 'GET',
                'url': 'https://www.gravatar.com/avatar?callback=JSON_CALLBACK',
                'responseType': 'arraybuffer'
            }).then(function(response) {

                if (response &&
                    response.headers &&
                    response.data) {

                    var contentType = response.headers('Content-Type'),
                        contentDisposition = response.headers('Content-Disposition'); /*Gravatar ATM don't send an Access-Control-Expose-Headers header so this value is lost...*/
                    $scope.resetDownload = false;
                    $scope.valueThatWillBePopulated = {
                        'contentType': contentType,
                        'responseData': response.data,
                        'fileName': 'thisIsTheFileName'
                    };
                }
            });
        }

        function activate() {

        }
        //notifyMe('segun');



        $scope.downloadcsv = function() {
            csvService.item(serviceBase + 'upload/' + $scope.authentication.userName + '/FL_insurance_sample.csv').then(function(response) {
                console.log(response);

                $scope.isAdmin = response;
                // console.log($scope.authentication);
            }, function(err) {

            });
        }
    }
]);