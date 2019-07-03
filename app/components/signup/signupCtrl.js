

scheduleApp.controller("signupCtrl", function($scope, $location, userSrv, $log ) {

    $scope.invalidSignup = false;
    // temporary hard code data
    $scope.username = "admin";
    // set for hard code defalut password to insure no mistakes
    $scope.pwd = "#Password123";
    $scope.email = "";
    $scope.role = "";
    $scope.siteId = -1;

    $scope.signup = function() {
        //mandatory fields - check required user and password
        // validate password - must contain a capital letter, lowercase letter, a number and be at least 8 characters long

        
        userSrv.signup($scope.username, $scope.email, $scope.role, $scope.siteId, $scope.pwd).then(function(activeUser) {
            $log.info("Successful login with: " + JSON.stringify(activeUser));
            // GUY TODO - will we have one type of dashboard or sevelral based on role???
            // for now - keep one dashbaord
            $location.path("/dashboard");
            //$rootScope.activeUser = activeUser;
        }, function(err) {
            $scope.invalidSignup = true;
        });

    }

})