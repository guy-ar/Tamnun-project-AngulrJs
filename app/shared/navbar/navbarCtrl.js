
scheduleApp.controller("navbarCtrl", function($scope, userSrv, $location, $log) {

    $scope.preventMenu = ["/login", "/error", "/signup", "/resetPass"];

    $scope.isLoggedIn = function() {
        return userSrv.isLoggedIn();
    }

    $scope.isLoggedAdmin = function() {
        return userSrv.isLoggedAdmion();
    }

    $scope.isLoggedTrainer = function() {
        return userSrv.isLoggedTrainer();
    }
    $scope.logout = function() {
        userSrv.logout();
        $scope.activeUser="";
        $location.path("/");
    }

    $scope.activeUser = null;
    $scope.$on('loginEvent', function(event, data) { 
        console.log("New login was created: " + data); 
        $scope.activeUser = data;
        // need to clean the rootscope - how???
    
    });
    


    // navbar will not be presetned on login/sign-up pages
    $scope.isShowMenu = function() {
        $log.info("current path:" + $location.$$path);
        // if ($location.$$path == "/login") {
        if ($scope.preventMenu.indexOf($location.$$path) >=0) {
            $log.info("login - do not show menu");
            return false;
        } else {
            $log.info("can show menu");
            return true;
        }
    }
})