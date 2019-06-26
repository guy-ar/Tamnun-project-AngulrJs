

scheduleApp.controller("loginCtrl", function($scope, $location, userSrv, $log /*,$rootScope*/ ) {

    $scope.invalidLogin = false;
    // temporary hard code data
    $scope.userId = "admin";
    $scope.pwd = "12345";

    $scope.login = function() {

        userSrv.login($scope.userId, $scope.pwd).then(function(activeUser) {
            $log.info("Successful login with: " + JSON.stringify(activeUser));
            // GUY TODO - will we have one type of dashboard or sevelral based on role???
            // for now - keep one dashbaord
            $location.path("/dashboard");
            //$rootScope.activeUser = activeUser;
        }, function(err) {
            $scope.invalidLogin = true;
        });

    }

})