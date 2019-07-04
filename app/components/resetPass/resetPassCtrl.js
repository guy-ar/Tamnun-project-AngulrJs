scheduleApp.controller("resetPassCtrl", function($scope, $location, userSrv, $log ) {

    $scope.email = "";
    $scope.invalidReset = false;
    $scope.errorType = "";
    $scope.errorMsg = "";

    $scope.resetPass = function(userEmail){
        if (userEmail =="" || userEmail == null || userEmail ==undefined)
        {
            $scope.errorType = "Required";
            $scope.errorMsg = "Please populate the Email";
            $scope.invalidReset = true;
        } else {
            $scope.errorType = "";
            $scope.errorMsg = "";
            $scope.invalidReset = false;
            userSrv.resetPass(userEmail).then(function(){
                // manage to send reset email - now need to wait for email            
                $location.path("/");
            }, function(err) {
                $scope.errorType = err.code;
                $scope.errorMsg = err.message;
                $scope.invalidReset = true;
                $scope.email="";
            });
        }

    }
    
    
    
})
