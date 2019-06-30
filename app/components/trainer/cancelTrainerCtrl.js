

scheduleApp.controller("cancelTrainerCtrl", function($scope, trainerSrv, $log, $uibModalInstance) {

    let  params = $scope.$resolve.params;
    $scope.id = params.id;
    $scope.isCancel = "";

   

    $scope.cancelTrainer = function() {
        if ($scope.isCancel){       
            trainerSrv.cancelTrainer($scope.id).then(function(cancelTrainer) {
                $log.info("Trainer was cancelled: " + JSON.stringify(cancelTrainer));
            
                // Closing the modal
             $uibModalInstance.close(cancelTrainer);
            });
        } else {
            // no cancel
            $uibModalInstance.close(undefined);
        }

    }

    $scope.cancelTrainerAction = function() {
        $scope.state = "";
        $scope.isCancel = "";
        $uibModalInstance.dismiss();
    }


})