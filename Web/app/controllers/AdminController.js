'use strict';
var controllerId = 'AdminController';
app.controller(controllerId, ['common', '$scope', '$location', 'authService', 'datasetsService',
    function (common, $scope, $location, authService, datasetsService) {
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logSuccess = getLogFn(controllerId, 'success');
    var logError = getLogFn(controllerId, 'error');
    log('Activated Dashboard View');

    $scope.authentication = authService.authentication;
    $scope.allroles = '';
    $scope.allrolesList = '';
    $scope.allUsersList = '';
    $scope.cRole = {
        userName: '',
        roles: ''
    };


    $scope.txtUsers = [];
    $scope.txtUserRoles = [];
    $scope.admin = {
        txtCategories: '',
        txtRoles:''
    };
    $scope.UserList = [];
    $scope.UnapprovedDatasetsList = [];
    $scope.ApprovedDatasetsList = [];
    $scope.DatasetsList = [];
    function activate() {
        getAllRoles();
    }


    authService.hasRole($scope.authentication.userName, 'Root').then(function (results) {
        if (results == false || results==null) {
            $location.path('../#/login');
        }
        console.log(results);
        $scope.orders = results.data;

    }, function (error) {
        console.log(error);
        //alert(error.data.message);
    });
    datasetsService.getDatasetsList().then(function (response) {
        console.log(response);
        $scope.DatasetsList = response.data;
    },
         function (err) {
             console.log(err);
             $scope.allroles = '';
         }
         );
    datasetsService.getDatasetsByStatus('false').then(function (response) {
        console.log(response);
        $scope.UnapprovedDatasetsList = response.data;
    },
     function (err) {
         console.log(err);
         $scope.allroles = '';
     }
     );

    datasetsService.getDatasetsByStatus('true').then(function (response) {
        console.log(response);
        $scope.ApprovedDatasetsList = response.data;
    },
     function (err) {
         console.log(err);
         $scope.allroles = '';
     }
     );



    authService.allUsers().then(function (response) {
        console.log(response);
        $scope.UserList = response;
    },
    function (err) {
        console.log(err);
        $scope.allroles = '';
    }
    );
    //function getAllRoles() {
    authService.allrolesList().then(function (response) {
            console.log(response);
            $scope.allrolesList = response;
        },
         function (err) {
             console.log(err);
             $scope.allroles ='';
         }
         ); 
    //}
    authService.allUsersList().then(function (response) {
             console.log(response);
             $scope.allUsersList = response;
         },
             function (err) {
                 console.log(err);
                 $scope.allUsersList = '';
             }
             );
  

    $scope.createNewCategories = function () {
        datasetsService.addCategory($scope.admin.txtCategories).then(function (response) {
            $scope.admin.txtCategories = '';
            console.log(response);
        },function (err) {
                console.log(err);
            });
    }

    $scope.createNewRole = function () {
        authService.addRole($scope.admin.txtRoles).then(function (response) {
            $scope.admin.txtRoles = '';
            console.log(response);
        }, function (err) {
            console.log(err);
        });
    }

    $scope.AddUser2RoleRole = function () {
        console.log($scope.txtUsers);
        var j = $scope.txtUsers.length; //length of Companies
        for (var i = 0; i < j; i++) {
            var user = $scope.txtUsers[i].text;
            log(user);
            var l = $scope.txtUserRoles.length; //length of Roles
            for (var i = 0; i < l; i++) {
                var roles = $scope.txtUserRoles[i].text
                $scope.cRole = {
                    userName:user,
                    roles: roles
                };
                authService.addUser2Role($scope.cRole).then(function (response) {
                    console.log(response);
                    //$scope.allUsersList = response;
                },
                 function (err) {
                     console.log(err);
                 });
            }
        }

       
    }
    $scope.editDatasetApproval = function (id, status,name) {
        datasetsService.editDatasetApproval(id, status).then(function (response) {
            log(name + ' succesfully edited')
           console.log(response);
        }, function (err) {
            log('error editing ' +name)
            console.log(err);
        });
        
    }

        $scope.loadAllRoles = function (query) {
            return $scope.allrolesList;
        };
        $scope.loadAllUsers = function (query) {
            return $scope.allUsersList;
        };
    
}]);