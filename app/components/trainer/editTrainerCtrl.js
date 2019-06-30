scheduleApp.controller("editTrainerCtrl", function($scope, trainerSrv, $log, $uibModalInstance) {

    let  params = $scope.$resolve.params;
    $scope.mode = "U";
    $scope.id = params.trainer.id;
    $scope.fname = params.trainer.fname;
    $scope.lname = params.trainer.lname;
    $scope.phone = params.trainer.phone;
    $scope.email = params.trainer.email;
    $scope.siteId = params.trainer.siteId;
    $scope.userName = params.trainer.userName;

   

    $scope.editTrainer = function() {

        trainerSrv.updateTrainer($scope.id, $scope.fname, $scope.lname, $scope.phone, $scope.email, $scope.siteId, $scope.userName).then(function(updateTrainer) {
            $log.info("Trainer was updated: " + JSON.stringify(updateTrainer));
            
            // Closing the modal
            $uibModalInstance.close(updateTrainer);
       });
    }

    $scope.cancelTrainerAction = function() {
        $scope.id = "";
        $scope.fname = "";
        $scope.lname = "";
        $scope.phone = "";
        $scope.email = "";
        $scope.siteId = "";
        $scope.userName = "";
        $uibModalInstance.dismiss();
    }


})