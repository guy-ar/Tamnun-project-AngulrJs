scheduleApp.controller("newWorkHoursCtrl", function($scope, workHourSrv, $log, $uibModalInstance) {
// guy TODO - might need new service for work hours instead userSrv
    let  params = $scope.$resolve.params;
    $scope.mode = "I";
    $scope.trainerId = params.id;
    $scope.day = "";
    $scope.startHour = new Date();
    $scope.endHour = new Date();
   
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;

    $scope.addWorkHours = function() {
        workHourSrv.addWorkHours($scope.trainerId, $scope.day, $scope.startHour, $scope.endHour).then(function(newWorkHour) {
             $log.info("new work hours was added: " + JSON.stringify(newWorkHour));
             // Closing the modal
             $uibModalInstance.close(newWorkHour);
        });
     }

    $scope.cancelWorkHourAction = function() {
        $scope.day = "";
        $scope.startHour = "";
        $scope.endHour = "";
        $uibModalInstance.dismiss();
    }

    

})