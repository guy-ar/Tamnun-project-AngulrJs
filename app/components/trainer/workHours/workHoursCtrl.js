scheduleApp.controller("workHoursCtrl", function($scope, workHourSrv, $log, userSrv, $uibModal) {
  $scope.trainer = userSrv.getLoginTrainer();

  $scope.trainerWh = [];
  // keep alsp the trainer work hours on the Ctrl
  workHourSrv.getWHForTrainer($scope.trainer.id).then(function(WorkHours) {
      $scope.trainerWh = WorkHours;
      $log.info(JSON.stringify($scope.trainerWh));

  }, function(err) {
      $log.error(err);
  })

  $scope.getTrainerWH = function(id) { 
    // return the work hours of the specific trainer
    return $scope.trainerWh;
  }

  $scope.addTrainerWorkHoursModal = function(trainer) {
    //$scope.activeTrainers = trainer;
    $log.info("the content of WH on trainersCtrl before adding: " + JSON.stringify($scope.trainersWh))
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/workHours/workHoursNew.html",
        controller: "workHoursNewCtrl",
        resolve: {
          params: function () {
            return {
              uId: trainer.id
            };
          }
        }
    });
    
    modalInstance.result.then(function(newWorkHours) {
      $log.info("need to update the current trainer to include the new workHours");
      
      $log.info("the content of WH on trainersCtrl after adding: " + JSON.stringify($scope.trainersWh))
      
      $scope.trainerWh.push(newWorkHours);
      
    }, function() {
        // this will wake up in case the user canceled the new work hours
        console.log("user canceled add work hours");
    })
  }

  

  $scope.editTrainerWorkHoursModal = function(editWorkHour) {

    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/workHours/workHoursEdit.html",
        controller: "workHoursEditCtrl",
        resolve: {
          params: function () {
            return {
              wh: editWorkHour
            };
          }
        }
    });
    
    modalInstance.result.then(function(workHoursRes) {
      $log.info("need to update the current trainer to include the new workHours");
      // look for the WH of the relevnt trainer
      let trainerWh = [];
      trainerWh = $scope.trainerWh
      for (let i=0; i< trainerWh.length; i++){
        if (trainerWh[i].id == workHoursRes.id)
        {
          trainerWh[i] = workHoursRes;
        }
      }
     
    }, function() {
        // this will wake up in case the user canceled the new work hours
        console.log("user canceled edit work hours");
    })
  
  }
  

 
  
  $scope.deleteTrainerWorkHoursModal = function(trainer, workHour) {

    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/workHours/workHoursCancel.html",
        controller: "workHoursCancelCtrl",
        resolve: {
          params: function () {
            return {
              wh: workHour
            };
          }
        }
    });
    
    modalInstance.result.then(function(deleteWorkHours) {
      
      $log.info("need to delete the current trainer not to include the workHours");
      // look for the WH of the relevnt trainer
      let trainerWh = [];
      trainerWh = $scope.trainerWh
      for (let i=0; i< trainerWh.length; i++){
        if (trainerWh[i].id == deleteWorkHours.id)
        {
          trainerWh.splice(i, 1);
        }
      }
    
     
    }, function() {
        // this will wake up in case the user canceled the delete work hours
        console.log("user canceled delete work hours");
    })
  
  }
})

