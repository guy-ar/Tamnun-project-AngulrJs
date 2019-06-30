scheduleApp.controller("newTrainerCtrl", function($scope, trainerSrv, $log, $uibModalInstance) {
    $scope.mode = "I";
    $scope.fname = "";
    $scope.lname = "";
    $scope.userName = "";
    $scope.phone = "";
    $scope.email = "";
    $scope.siteId = "";

    $scope.addTrainer = function() {
        trainerSrv.addTrainer($scope.fname, $scope.lname, $scope.phone, $scope.email, $scope.siteId, $scope.userName).then(function(newTrainer) {
            $log.info("new Trainer was added: " + JSON.stringify(newTrainer));
            // Closing the modal
            $uibModalInstance.close(newTrainer);
       });
    }

    $scope.cancelTrainerAction = function() {
        $scope.fname = "";
        $scope.lname = "";
        $scope.phone = "";
        $scope.email = "";
        $scope.siteId = "";
        $scope.userName = "";
        $uibModalInstance.dismiss();
    }


})