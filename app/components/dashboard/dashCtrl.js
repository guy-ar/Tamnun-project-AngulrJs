scheduleApp.controller("dashCtrl", function($scope, userSrv, $location) {
  
    
    //if user is not logged in - go to home
    if (!userSrv.isLoggedIn()) {
        $location.path("/");
        return;
    }
  
    $scope.isAdmin = userSrv.isLoggedAdmion();
    $scope.isTrainer = userSrv.isLoggedTrainer();
    $scope.activeUser = userSrv.getActiveUser();
});