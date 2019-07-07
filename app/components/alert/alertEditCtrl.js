scheduleApp.controller("alertEditCtrl", function($scope, alertSrv, $log, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
    let  params = $scope.$resolve.params;
    let alert = params.alert;
    
   
    $scope.alertId = alert.id;
    
    $scope.alertName = alert.name;
    $scope.description = alert.description;


    $scope.editAlert = function() {
                
        alertSrv.editAlertByTrainer($scope.alertId, $scope.alertName, $scope.description)
            .then(function(editAlert) {
                $log.info("alert was updated: " + JSON.stringify(editAlert));
                // Closing the modal

                $uibModalInstance.close(editAlert);
        });
        }

    $scope.cancelAlertAction = function() {
        $scope.alertId = "";
        $scope.alertName = "";
        $scope.description = "";
        $uibModalInstance.dismiss();
    }



})