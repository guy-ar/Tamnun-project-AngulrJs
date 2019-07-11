scheduleApp.controller("dashCtrl", function($scope, userSrv, $location) {
  
    
    //if user is not logged in - go to home
    if (!userSrv.isLoggedIn()) {
        $location.path("/");
        return;
    }
  
    $scope.isAdmin = userSrv.isLoggedAdmion();
    $scope.isTrainer = userSrv.isLoggedTrainer();
    $scope.activeUser = userSrv.getActiveUser();
    // releveant only if trainer logged in
    $scope.trainer = userSrv.getLoginTrainer();
    $scope.$emit('trainerAddedEvent', $scope.trainer);

   

    // Chart.JS
    var data = [];
    $scope.labels = ["Private Lesson", "Group Class"];
    $scope.options = {
        legend: {
        display: true
        }
    }
  
  $scope.getChartData = function() {
    // return dummy information - need to find a way to get it from the directive
        

     data[0] = 15;
     data[1] = 5;
    return data;
  }
});