scheduleApp.controller("workHoursEditCtrl", function($scope, workHourSrv, $log, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
        let  params = $scope.$resolve.params;
        $scope.editId = params.wh.id;
        $scope.editDay = params.wh.day;
        // convert format of HH:MM to date that can work with TimePicker
        let timeParts = params.wh.startHour.split(":");
        $scope.editStart = new Date(1970, 0, 1, timeParts[0], timeParts[1], 0, 0);
        timeParts = params.wh.endHour.split(":");
        $scope.editEnd = new Date(1970, 0, 1, timeParts[0], timeParts[1], 0, 0);
        
        
       
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.ismeridian = false;
    
        
    
        $scope.cancelWorkHourAction = function() {
            $scope.editDay = "";
            $scope.editStart = "";
            $scope.editEnd = "";
            $uibModalInstance.dismiss();
        }
    
        
    
        $scope.editWorkHours = function() {
            // we need only the hours and minutes
    
            workHourSrv.editWorkHours($scope.editId, $scope.editDay,  workHourSrv.getTimeFromDate($scope.editStart), 
                workHourSrv.getTimeFromDate($scope.editEnd)).then(function(updatedWH) {
                 $log.info("new work hours was added: " + JSON.stringify(updatedWH));
                 // Closing the modal
    
                 $uibModalInstance.close(updatedWH);
            });
        }
    
    
        
    })