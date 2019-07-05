scheduleApp.controller("workHoursCancelCtrl", function($scope, workHourSrv, $log, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
        let  params = $scope.$resolve.params;
        
        
        $scope.id = params.wh.id;
        $scope.cancelDay = params.wh.day;
        $scope.cancelStart = params.wh.startHour;
        $scope.cancelEnd =  params.wh.endHour;
        
        
       
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.ismeridian = false;
    
        
    
        $scope.cancelWorkHourAction = function() {
            $scope.cancelDay = "";
            $scope.cancelStart = "";
            $scope.cancelEnd = "";
            $uibModalInstance.dismiss();
        }
    
        
    
    
        $scope.deleteWorkHours = function() {
            // delete the entry - need only whId
    
            workHourSrv.deleteWorkHours($scope.id).then(function(deleteWorkHour) {
                 $log.info("work hours was deleted: " + JSON.stringify(deleteWorkHour));
                 // Closing the modal
    
                 $uibModalInstance.close(deleteWorkHour);
            });
        }
    })