scheduleApp.controller("alertEditCtrl", function($scope, alertSrv, $log, userSrv, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
    let  params = $scope.$resolve.params;
    let alert = params.alert;
    
    $scope.isAdmin = userSrv.isLoggedAdmion();
    $scope.isTrainer = userSrv.isLoggedTrainer();

    $scope.alertId = alert.id;
    
    $scope.alertName = alert.name;
    $scope.description = alert.description;
    $scope.resolutionType = alert.resolutionType;
    $scope.resolution = alert.resolutionDtls;
    $scope.state = alert.state;
    $scope.isHandled =false;

    $scope.editAlert = function() {
        if ($scope.isTrainer) {
            alertSrv.editAlertByTrainer($scope.alertId, $scope.alertName, $scope.description)
                .then(function(editAlert) {
                    $log.info("alert was updated: " + JSON.stringify(editAlert));
                    // Closing the modal

                    $uibModalInstance.close(editAlert);
                    });
        } else if ($scope.isAdmin) {
            alertSrv.editAlertByAdmin($scope.alertId, $scope.resolutionType, $scope.resolution, $scope.isHandled)
                .then(function(editAlert) {
                    $log.info("alert was updated: " + JSON.stringify(editAlert));
                    // Closing the modal

                    $uibModalInstance.close(editAlert);
                    });
        } 

    }

    $scope.cancelAlertAction = function() {
        $scope.alertId = "";
        $scope.alertName = "";
        $scope.description = "";
        $scope.resolutionType = "";
        $scope.resolution = "";
        $scope.isHandled = "";
        $uibModalInstance.dismiss();
    }



})