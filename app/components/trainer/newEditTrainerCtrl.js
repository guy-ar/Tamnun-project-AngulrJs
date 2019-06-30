scheduleApp.controller("newEditTrainerCtrl", function($scope, trainerSrv, $log, $uibModalInstance) {
    let  params = $scope.$resolve.params;
    $scope.mode = params.mode;

    if ( $scope.mode == "I") {
        $scope.fname = "";
        $scope.lname = "";
        $scope.userName = "";
        $scope.phone = "";
        $scope.email = "";
        $scope.siteId = "";
    } else if ( $scope.mode == "U"){
        $scope.id = params.trainer.id;
        $scope.fname = params.trainer.fname;
        $scope.lname = params.trainer.lname;
        $scope.phone = params.trainer.phone;
        $scope.email = params.trainer.email;
        $scope.siteId = params.trainer.siteId;
        $scope.userName = params.trainer.userName;
    
    } else {
        // error occured - do not continue
        return;
    }
    $scope.addTrainer = function() {
        trainerSrv.addTrainer($scope.fname, $scope.lname, $scope.phone, $scope.email, $scope.siteId, $scope.userName).then(function(newTrainer) {
            $log.info("new Trainer was added: " + JSON.stringify(newTrainer));
            // Closing the modal
            $uibModalInstance.close(newTrainer);
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

    $scope.editTrainer = function() {

        trainerSrv.updateTrainer($scope.id, $scope.fname, $scope.lname, $scope.phone, $scope.email, $scope.siteId, $scope.userName).then(function(updateTrainer) {
            $log.info("Trainer was updated: " + JSON.stringify(updateTrainer));
            
            // Closing the modal
            $uibModalInstance.close(updateTrainer);
       });
    }

})