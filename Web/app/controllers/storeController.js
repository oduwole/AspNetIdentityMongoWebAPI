'use strict';
app.controller('storeController', ['common', '$scope', '$http', '$routeParams', 'storeService', 'authService', 'ngAuthSettings', '$log', '$window', 'datasetsService', 'transactionsService', 'notificationService',
    function(common, $scope, $http, $routeParams, storeService, authService, ngAuthSettings, $log, $window, datasetsService, transactionsService, notificationService) {
        $scope.priceZero = false;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        // get store and cart from service
        //$scope.store = DataService.store;
        //$scope.cart = DataService.cart;
        $scope.authentication = authService.authentication;
        $scope.store = storeService.store;
        $scope.cart = storeService.cart;
        //console.log($scope.cart);

        var transDetails = {
            transactionID: '',
            reverseStatus: false,
            clientID: '',
            merchantID: '',
            transactionDate: '',
            transactionIP: '',
            productPrice: '',
            productID: ''
        };

        if ($scope.cart.getTotalPrice()) {
            $scope.priceZero = true;
        }
        // use routing to pick the selected product
        if ($routeParams.productSku != null) {

            $scope.product = $scope.store.getProduct($routeParams.productSku);
            console.log($scope.product);
        }



        $scope.downloadFiles = function downloadStuffFromAjax() {

            $http({
                    'method': 'GET',
                    'url': serviceBase + 'filestreaming/download?user=segxy2708@yahoo.com&filename=uspf-lga.xlsx',
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
                    console.log(response);
                })
                //.error(function (err, status) {
                //            log('Error Downloading file. CORS');
                //        });
        }



        $scope.downloadFile = function() {
            //debugger;
            var no_of_items = $scope.cart.items.length;
            for (var i = 0; i < no_of_items; i++) {
                var fileUrl = $scope.cart.items[i].fileUrl;
                $scope.FileExt = fileUrl.substr(fileUrl.length - 4);
                var itemId = $scope.cart.items[i].sku;
                // $scope.FileExt = $scope.files[0].name.substr($scope.files[0].name.length - 4);
                //$scope.GenerateFileType('xlsx');//($scope.FileExt);

                var re = /uploads\//gi;
                var newstr = fileUrl.replace(re, '');
                //var emailRegEx=/^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/gi;
                // var emailRegEx = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}/gi;
                var emailRegEx = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?/gi;
                var iSent = newstr.replace(emailRegEx, '');
                var result = iSent.replace('\/', '');
                transDetails.clientID = $scope.authentication.userName;
                transDetails.merchantID = '';
                transDetails.productID = itemId;
                transDetails.productPrice = $scope.cart.items[i].price;
                transDetails.transactionDate = '';
                transDetails.transactionIP = $scope.ip;

                $scope.GenerateFileType($scope.FileExt);
                $scope.RenderFile(itemId, result, transDetails);
            }

        }
        transactionsService.clientIp().then(function(responses) {
            console.log(responses.data.ip);
            $scope.ip = responses.data.ip;
        }, function(err) {
            //logError('error to download file');
        });


        $scope.RenderFile = function(transid, filename_transDetails) {
            //var s = "http://localhost:53154/api/FileUploader/DownLoadFile?"
            //   + "FileName=" + $scope.files[0].name
            //   + "&fileType=" + $scope.FileType;
            //var s = 'http://deitalystapi.azurewebsites.net/filestreaming/download?user=segxy2708@yahoo.com&filename=uspf-lga.xlsx';
            datasetsService.getDatasetPathFromTId(transid).then(function(response) {
                var merchantName = response.data;
                var s = serviceBase + 'filestreaming/download?user=' + merchantName + '&filename=' + filename;


                transactionsService.transactionsSave(_transDetails, $scope.authentication.userName).then(function(responses) {

                    $window.open(s);

                }, function(err) {
                    logError('error to download file');
                });

                //$window.open(s);

            }, function(err) {

            });

        }

        $scope.GenerateFileType = function(fileExtension) {
            switch (fileExtension.toLowerCase()) {
                case "doc":
                case "docx":
                    $scope.FileType = "application/msword";
                    break;
                case "xls":
                case "xlsx":
                    $scope.FileType = "application/vnd.ms-excel";
                    break;
                case "pps":
                case "ppt":
                    $scope.FileType = "application/vnd.ms-powerpoint";
                    break;
                case "txt":
                    $scope.FileType = "text/plain";
                    break;
                case "rtf":
                    $scope.FileType = "application/rtf";
                    break;
                case "pdf":
                    $scope.FileType = "application/pdf";
                    break;
                case "msg":
                case "eml":
                    $scope.FileType = "application/vnd.ms-outlook";
                    break;
                case "gif":
                case "bmp":
                case "png":
                case "jpg":
                    $scope.FileType = "image/JPEG";
                    break;
                case "dwg":
                    $scope.FileType = "application/acad";
                    break;
                case "zip":
                    $scope.FileType = "application/x-zip-compressed";
                    break;
                case "rar":
                    $scope.FileType = "application/x-rar-compressed";
                    break;
            }
        }

        $scope.proceed = function() {
            window.location = "#/checkout";
        }

        var wizardPages = [
            'app/views/ShoppingCart/step1.html',
            'app/views/ShoppingCart/step2.html',
            'app/views/ShoppingCart/step3.html',
            'app/views/ShoppingCart/step4.html'
        ];

        //The initial current page will be 0 (Entree.html)
        var currentPage = 0;


        //Define a wizardData object to bind the users selections too.
        $scope.wizardData = {};

        //Return the currently activated view
        $scope.getCurrentStepView = function() {
            return wizardPages[currentPage];
        }

        //Used to disable / enable the 'Back' button
        //(Not the browsers back button, but the wizards)
        $scope.currentPage = function() {
            return currentPage;
        }

        //Used to disable / enable the 'Next' button
        $scope.lastPageIsDisplaying = function() {
            return currentPage >= wizardPages.length - 1;
        }

        //The 'Back' button click event
        $scope.backBtnClick = function() {
            if (currentPage == 0)
                return;

            currentPage -= 1;
        }

        //The 'Next' button click event
        $scope.nextBtnClick = function() {
            if (currentPage >= wizardPages.length - 1)
                return;

            currentPage += 1;
        }

        $scope.saveBtnClick = function() {
            notificationService.notifyMe('summary');
            //We're not actually going to go save it, that's outside the scope of this demo!
            var summary = "Your " + $scope.wizardData.entree + " selection has been saved.";
            //alert(summary);
            console.log(summary);

        }
    }
]);