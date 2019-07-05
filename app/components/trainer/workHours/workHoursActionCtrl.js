scheduleApp.controller("workHoursActionCtrl", function($scope, workHourSrv, $log, $uibModalInstance) {
// guy TODO - might need new service for work hours instead userSrv
    let  params = $scope.$resolve.params;
    $scope.mode = params.mode;
    $scope.trainerId = params.uId;
    if ( $scope.mode == "I") {
        $scope.day = "";
        $scope.startHour = new Date("01/01/1970");
        $scope.endHour = new Date("01/01/1970");

    } else if ($scope.mode == "U") {
        $scope.id = params.wh.id;
        $scope.day = params.wh.day;
        // convert format of HH:MM to date that can work with TimePicker
        let timeParts = params.wh.startHour.split(":");
        $scope.startHour = new Date(1970, 0, 1, timeParts[0], timeParts[1], 0, 0);
        timeParts = params.wh.endHour.split(":");
        $scope.endHour = new Date(1970, 0, 1, timeParts[0], timeParts[1], 0, 0);
    } else if ($scope.mode == "D") {
        $scope.id = params.wh.id;
        $scope.day = params.wh.day;
        $scope.startHour = params.wh.startHour;
        $scope.endHour =  params.wh.endHour;
    }
    
   
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = false;

    $scope.addWorkHours = function() {
        // we need only the hours and minutes

        //workHourSrv.addWorkHours($scope.trainerId, $scope.day,  $scope.getTimeFromDate($scope.startHour), 
        workHourSrv.addWorkHours($scope.trainerId, $scope.day,  $scope.getTimeFromDate($scope.startHour), 
            $scope.getTimeFromDate($scope.endHour)).then(function(newWorkHour) {
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

    // logic to insure that hours retrieved from date will be set on valid formet
    $scope.addZero = function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    // test fuction for setting the hours and minutes from date
    $scope.getTimeFromDate  = function(dateObj) {
        
        var time = "";
        var h = $scope.addZero(dateObj.getHours());
        var m = $scope.addZero(dateObj.getMinutes());
        time = h + ":" + m;
        return time;
    }

    $scope.editWorkHours = function() {
        // we need only the hours and minutes

        workHourSrv.editWorkHours( $scope.day,  $scope.getTimeFromDate($scope.startHour), 
                $scope.getTimeFromDate($scope.endHour)).then(function(updatedWH) {
             $log.info("new work hours was added: " + JSON.stringify(updatedWH));
             // Closing the modal

             $uibModalInstance.close(updatedWH);
        });
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