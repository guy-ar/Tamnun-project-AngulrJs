scheduleApp.controller("newTrainerCtrl", function($scope, userSrv, $log, $uibModalInstance) {
    $scope.mode = "I";
    $scope.fname = "";
    $scope.lname = "";
    $scope.userId = "";
    $scope.phone = "";
    $scope.email = "";
    $scope.siteId = "";

    $scope.addTrainer = function() {
       userSrv.addTrainer($scope.fname, $scope.lname, $scope.phone, $scope.email, $scope.siteId, $scope.userId).then(function(newTrainer) {
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
        $scope.userId = "";
        $uibModalInstance.dismiss();
    }


})