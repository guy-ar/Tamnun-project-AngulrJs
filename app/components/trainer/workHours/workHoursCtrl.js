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
    
    $log.info("the content of WH on trainersCtrl before adding: " + JSON.stringify($scope.trainersWh))
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/workHours/workHoursActions.html",
        controller: "workHoursActionCtrl",
        resolve: {
          params: function () {
            return {
              mode: "I",
              uId: trainer.id
            };
          }
        }
    });
    
    modalInstance.result.then(function(newWorkHours) {
      $log.info("need to update the current trainer to include the new workHours");
      
      $log.info("the content of WH on trainersCtrl after adding: " + JSON.stringify($scope.trainerWh))
      $scope.trainerWh.push(newWorkHours);
      
    }, function() {
        // this will wake up in case the user canceled the new work hours
        console.log("user canceled add work hours");
    })
  }

  $scope.editTrainerWorkHoursModal = function(trainer, workHour) {

    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/workHours/workHoursActions.html",
        controller: "workHoursActionCtrl",
        resolve: {
          params: function () {
            return {
              mode: "U",
              uId: trainer.id,
              wh: workHour
            };
          }
        }
    });
    
    modalInstance.result.then(function(editWorkHours) {
      $log.info("need to update the current trainer to include the new workHours");
      // look for the WH of the relevnt trainer
      let trainerWh = [];
      trainerWh = $scope.trainerWh;
      for (let i=0; i< trainerWh.length; i++){
        if (trainerWh[i].id == editWorkHours.id)
        {
          trainerWh[i] = editWorkHours;
        }
      }
      
    }, function() {
        // this will wake up in case the user canceled the new work hours
        console.log("user canceled edit work hours");
    })
  }
      
    
  $scope.deleteTrainerWorkHoursModal = function(trainer, workHour) {

    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/workHours/workHoursActions.html",
        controller: "workHoursActionCtrl",
        resolve: {
          params: function () {
            return {
              mode: "D",
              uId: trainer.id,
              wh: workHour
            };
          }
        }
    });
    
    modalInstance.result.then(function(deleteWorkHours) {
      
      $log.info("need to delete the current trainer not to include the workHours");
      // look for the WH of the relevnt trainer
      let trainerWh = [];
      trainerWh = $scope.trainerWh;
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

