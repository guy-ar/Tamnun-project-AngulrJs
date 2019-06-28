scheduleApp.controller("editTrainerCtrl", function($scope, userSrv, $log, $uibModalInstance) {

    let  params = $scope.$resolve.params;
    $scope.mode = "U";
    $scope.id = params.trainer.id;
    $scope.fname = params.trainer.fname;
    $scope.lname = params.trainer.lname;
    $scope.phone = params.trainer.phone;
    $scope.email = params.trainer.email;
    $scope.siteId = params.trainer.siteId;
    $scope.userId = params.trainer.userId;

   

    $scope.editTrainer = function() {

        userSrv.updateTrainer($scope.id, $scope.fname, $scope.lname, $scope.phone, $scope.email, $scope.siteId, $scope.userId).then(function(updateTrainer) {
            $log.info("Trainer was updated: " + JSON.stringify(updateTrainer));
            
            // Closing the modal
            $uibModalInstance.close(updateTrainer);
       });
    }

    $scope.cancelTrainerAction = function() {
        $scope.fname = "";
        $scope.lname = "";
        $scope.phone = "";
        $scope.email = "";
        $scope.siteId = "";
        $scope.userId = "";
        $uibModalInstance.dismiss();
    }


})