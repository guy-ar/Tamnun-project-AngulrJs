scheduleApp.controller("alertCancelCtrl", function($scope, alertSrv, $log, $uibModalInstance) {

    let  params = $scope.$resolve.params;
    let alert = params.alert;
    
   
    $scope.alertId = alert.id;
    
    $scope.alertName = alert.name;
    $scope.description = alert.description;


    $scope.deleteAlert = function() {
                
        alertSrv.deleteAlert($scope.alertId)
            .then(function(deleteAlert) {
                $log.info("alert was deleted: " + JSON.stringify(deleteAlert));
                // Closing the modal

                $uibModalInstance.close(deleteAlert);
        });
        }

    $scope.cancelAlertAction = function() {
        $scope.alertId = "";
        $scope.alertName = "";
        $scope.description = "";
        $uibModalInstance.dismiss();
    }
});