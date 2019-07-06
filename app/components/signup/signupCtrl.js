

scheduleApp.controller("signupCtrl", function($scope, $location, userSrv, trainerSrv, $log ) {

    $scope.invalidSignup = false;
    // temporary hard code data
    $scope.username = "admin";
    // set for hard code defalut password to insure no mistakes
    $scope.pwd = "#Password123";
    $scope.email = "";
    $scope.role = "trainer";
    $scope.siteId = "-1";
    $scope.errorMsg = "";
    $scope.errorType = "";
    $scope.invalidFld = "";
    

    $scope.signupUser = function() {
        //mandatory fields - check required user and password
        // validate password - must contain a capital letter, lowercase letter, a number and be at least 8 characters long
        if (!$scope.clientInputValidation()) 
            return false;
        
        userSrv.signupAndValidate($scope.username, $scope.email, $scope.role, $scope.siteId, $scope.pwd).then(function(activeUser) {
            $log.info("Successful login with: " + JSON.stringify(activeUser));
            if (userSrv.isLoggedTrainer()) {
                //call to update trainer...
                trainerSrv.updateRegisterUser(userSrv.getLoginTrainer().id, activeUser.id, activeUser.email).then(function(trainer){
                    //nothing to do besides log
                    console.info('Trainer was updated with user details', trainer);
                }, function(error){
                    //nothing to do besides log
                    console.error('Error while updating the trainer with user details', err);

                });
                // return the user
            }
            
            $location.path("/dashboard");
            //$rootScope.activeUser = activeUser;
        }, function(err) {
            $log.error(err.code + " " + err.message);
            $scope.errorType = err.message;
            $scope.invalidSignup = true;
        });

    }

    $scope.emailIsValid = function(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    $scope.checkRequired = function(val) {
        if (val == "" || val == undefined || val ==null) {
            return false;
        } else {
            return true;
        }
    }

    $scope.checkValidPwd = function(pwd)
    {
        ///^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/
        return /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/.test(pwd);
    }

    $scope.clientInputValidation = function(){
        if (!$scope.emailIsValid($scope.email)){
            $scope.invalidFld="email";
            $scope.errorMsg = "Please valid Email address.";
            $scope.errorType = "Invalid Email! ";
            $scope.invalidSignup = true;
            return false;
        } else if (!$scope.checkRequired($scope.username)){
            $scope.invalidFld="username";
            $scope.errorMsg = "User Name must have value.";
            $scope.errorType = "Invalid User Name! ";
            $scope.invalidSignup = true;
            return false;

        } else if (!$scope.checkRequired($scope.pwd) || !$scope.checkValidPwd($scope.pwd)){
            $scope.invalidFld="pwd";
            $scope.errorMsg = "Password must have valid value.";
            $scope.errorType = "Invalid Password! ";
            $scope.invalidSignup = true;
            return false;
        }  else {
            $scope.invalidFld="";
            $scope.errorMsg = "";
            $scope.errorType = "";
            $scope.invalidSignup = false;
            return true;
        }

    }
})