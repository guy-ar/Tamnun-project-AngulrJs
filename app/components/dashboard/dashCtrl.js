scheduleApp.controller("dashCtrl", function($scope, $log, userSrv, $location) {
  
    // Guy - Hide till dashbord will be ready
    // if user is not logged in - go to home
    // if (!userSrv.isLoggedIn()) {
    //     $location.path("/");
    //     return;
    // }
  
    $scope.isAdmin = userSrv.isLoggedAdmion();
    $scope.isTrainer = userSrv.isLoggedTrainer();
});