scheduleApp.controller("workHoursNewCtrl", function($scope, workHourSrv, $log, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
        let  params = $scope.$resolve.params;
       
        $scope.trainerId = params.uId;
        $scope.newDay = "";
        $scope.newStart = new Date("01/01/1970");
        $scope.newEnd = new Date("01/01/1970");
    
       
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.ismeridian = false;
    
        $scope.addWorkHours = function() {
            // we need only the hours and minutes
    
            
            workHourSrv.addWorkHours($scope.trainerId, $scope.newDay,  workHourSrv.getTimeFromDate($scope.newStart), 
                workHourSrv.getTimeFromDate($scope.newEnd)).then(function(newWorkHour) {
                 $log.info("new work hours was added: " + JSON.stringify(newWorkHour));
                 // Closing the modal
    
                 $uibModalInstance.close(newWorkHour);
            });
         }
    
        $scope.cancelWorkHourAction = function() {
            $scope.newday = "";
            $scope.startHour = "";
            $scope.endHour = "";
            $uibModalInstance.dismiss();
        }
    
    })