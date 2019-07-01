
scheduleApp.controller("navbarCtrl", function($scope, userSrv, $location, $log) {

    $scope.preventMenu = ["/login", "/error"];

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
        $location.path("/");
    }

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