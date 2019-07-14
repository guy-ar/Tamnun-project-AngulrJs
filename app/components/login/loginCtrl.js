

scheduleApp.controller("loginCtrl", function($scope, $location, userSrv, $log ,$rootScope ) {

    $scope.invalidLogin = false;
    // temporary hard code data
    $scope.userIdOrEmail = "admin";
    $scope.pwd = "12345";
    // $scope.userIdOrEmail = "morar";
    // $scope.pwd = "#Password123";

    $scope.login = function() {

        userSrv.login($scope.userIdOrEmail, $scope.pwd).then(function(activeUser) {
            $log.info("Successful login with: " + JSON.stringify(activeUser));
            // GUY TODO - will we have one type of dashboard or sevelral based on role???
            // for now - keep one dashbaord
            $rootScope.$broadcast('loginEvent', activeUser);
            $location.path("/dashboard");
            //$rootScope.activeUser = activeUser;
        }, function(err) {
            $scope.invalidLogin = true;
        });

        
    }

    

})