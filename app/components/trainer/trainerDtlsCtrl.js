scheduleApp.controller("trainerDtlsCtrl", function($scope, $log, userSrv, trainerSrv, $location, $routeParams, $uibModal) { 

    if (!userSrv.isLoggedIn()) {
        $location.path("/");
        return;
    }

    trainerSrv.getTrainerById($routeParams.id).then(function(trainer) {
        $scope.trainer = trainer;
        $scope.$emit('trainerAddedEvent', $scope.trainer);
    
    }, function(err) {
            $log.error(err);
    });

   

    $scope.openEditTrainerModal = function(trainer) {

        var modalInstance = $uibModal.open({
            templateUrl: "app/components/trainer/trainerNewEdit.html",
            controller: "newEditTrainerCtrl",
            resolve: {
                params: function () {
                return {
                    mode: "U",
                    trainer: trainer
                };
                }
            }
        });
        
        modalInstance.result.then(function(editTrainer) {
            $log.info("need to update the current trainer");
            // this will wake in case the user updated a trainer
            $scope.trainer = editTrainer;
                           
        }, function() {
            // this will wake up in case the user canceled the new trainer
            console.log("user canceled edit trainer");
        })
    }
        
    $scope.openCancelTrainerModal = function(trainer) {
        if (trainer.state == "Cancel") {
            alert("User is already cancelled!");
            return
        }
            
        //$scope.activeTrainers = trainer;
        var modalInstance = $uibModal.open({
            templateUrl: "app/components/trainer/trainerCancel.html",
            controller: "cancelTrainerCtrl",
            resolve: {
                params: function () {
                    return {
                    id: trainer.id
                    };
                }
            }
        });
    
        modalInstance.result.then(function(editTrainer) {
            if (editTrainer == undefined){
            //no cancel was done
            $log.info("trainer was not cancelled");
            } else {
                $log.info("need to update the current trainer state to cancel");
                $scope.trainer = editTrainer;
            }
        }, function() {
            // this will wake up in case the user canceled the new trainer
            console.log("user canceled cancel trainer");
        })
    }

})
