scheduleApp.controller("trainersCtrl", function($scope, $log, userSrv, trainerSrv, workHourSrv, $uibModal) { 

  $scope.trainers = [];
  //$scope.activeTrainers = null;
  
  $scope.trainersWh = {};

  // get the trainers
  trainerSrv.getTrainers().then(function(users) {
    $scope.trainers = users;
  }, function(err) {
    $log.error(err);
  })


  // keep alsp the trainer work hours on the Ctrl
  workHourSrv.getTrainersWH().then(function(usersWorkHours) {
    $scope.trainersWh = usersWorkHours;
    $log.info(JSON.stringify($scope.trainersWh));

  }, function(err) {
    $log.error(err);
  })

  $scope.query = "";
  $scope.filterTrainer = function(trainer) {    
    // converting to lower case to do a case insensitive comparison
    if (trainer.fname.toLowerCase().includes($scope.query.toLowerCase()) || 
        trainer.lname.toLowerCase().includes($scope.query.toLowerCase())) {
          // check if need to present cancel
          if (($scope.isCancel) && (trainer.state=="Cancel")){
            // check the state
            return false;
          }
      return true;
    } else {
      return false;
    }
  }


  $scope.getTrainerWH = function(id) { 
    // return the work hours of the specific trainer
    let currentWhs = [];
    currentWhs = $scope.trainersWh[id];
    return currentWhs;
  }

  $scope.openNewTrainerModal = function() {
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/trainerNewEdit.html",
        controller: "newEditTrainerCtrl",
        resolve: {
          params: function () {
            return {
              mode: "I"
            };
          }
        }
    });

    modalInstance.result.then(function(newTrainer) {
        // this will wake in case the user added a new trainer
        $scope.trainers.push(newTrainer);
        //$scope.activeTrainers = newTrainer;
    }, function() {
        // this will wake up in case the user canceled the new trainer
        console.log("user canceled new trainer");
    })
  }

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
        for (let i = 0; i < $scope.trainers.length; i++)
        {
          if ($scope.trainers[i].id == trainer.id) {
            $scope.trainers[i] = editTrainer;
          }
        }
        
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
        for (let i = 0; i < $scope.trainers.length; i++)
        {
          if ($scope.trainers[i].id == trainer.id) {
            $scope.trainers[i] = editTrainer;
          }
        }
      }
    }, function() {
        // this will wake up in case the user canceled the new trainer
        console.log("user canceled cancel trainer");
    })
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
      if (!$scope.trainersWh[trainer.id]){
        // trainer did not had former workhours
        $scope.trainersWh[trainer.id] = [];
      }
      $scope.trainersWh[trainer.id].push(newWorkHours);
      
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
      trainerWh = $scope.trainersWh[workHoursRes.trainerId];
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
      trainerWh = $scope.trainersWh[deleteWorkHours.trainerId];
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