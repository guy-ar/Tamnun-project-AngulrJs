scheduleApp.controller("alertNewCtrl", function($scope, alertSrv, $log, utilSrv, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
    let  params = $scope.$resolve.params;
    let activity = params.activity;
    
    $scope.trainerId = params.uId;
    $scope.activityId = activity.id;
    $scope.eventName = activity.eventDtls.eventName;
    $scope.activityDate = activity.activityDate;
    $scope.activityTime = activity.activityTime;
    $scope.alertName = "";
    $scope.description = "";


    $scope.addAlert = function() {
                
        alertSrv.createAlert($scope.trainerId, $scope.activityId, $scope.alertName, $scope.description)
            .then(function(newAlert) {
                $log.info("new alert was added: " + JSON.stringify(newAlert));
                // Closing the modal

                $uibModalInstance.close(newAlert);
        });
        }

    $scope.cancelAlertAction = function() {
        $scope.eventName = "";
        $scope.activityDate = null;
        $scope.activityTime = "";
        $scope.alertName = "";
        $scope.description = "";
        $uibModalInstance.dismiss();
    }

    $scope.formatDate = function(date){
        return utilSrv.formatDate(date);
    }

})