
scheduleApp.controller("navbarCtrl", function($scope, userSrv, $location, $log) {


    $scope.isLoggedIn = function() {
        return userSrv.isLoggedIn();
    }

    $scope.logout = function() {
        userSrv.logout();
        $location.path("/");
    }

    // navbar will not be presetned on login/sign-up pages
    $scope.isShowMenu = function() {
        $log.info("current path:" + $location.$$path);
        if ($location.$$path == "/login") {
            $log.info("login - do not show menu");
            return false;
        } else {
            $log.info("can show menu");
            return true;
        }
    }
})