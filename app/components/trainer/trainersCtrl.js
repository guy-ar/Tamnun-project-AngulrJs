scheduleApp.controller("trainersCtrl", function($scope, $log, userSrv, $uibModal) { 

  $scope.trainers = [];
  $scope.activeTrainers = null;
  // get the trainers
  userSrv.getTrainers().then(function(users) {
    $scope.trainers = users;
  }, function(err) {
    $log.error(err);
  })

  $scope.query = "";
  $scope.filterTrainer = function(trainer) {    
    // converting to lower case to do a case insensitive comparison
    if (trainer.fname.toLowerCase().includes($scope.query.toLowerCase()) || 
        trainer.lname.toLowerCase().includes($scope.query.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  $scope.openNewTrainerModal = function() {
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/trainerNewEdit.html",
        controller: "newTrainerCtrl"
    });

    modalInstance.result.then(function(newTrainer) {
        // this will wake in case the user added a new trainer
        $scope.trainers.push(newTrainer);
    }, function() {
        // this will wake up in case the user canceled the new trainer
        console.log("user canceled new trainer");
    })
  }

  $scope.openEditTrainerModal = function(trainer) {
    $scope.activeTrainers = trainer;
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/trainer/trainerNewEdit.html",
        controller: "editTrainerCtrl",
        resolve: {
          params: function () {
             return {
              trainer: trainer
             };
          }
        }
    });

    modalInstance.result.then(function(editTrainer) {
        $log.info("need to update the current trainer");
        // this will wake in case the user added a new trainer
        $scope.activeTrainers = editTrainer;
    }, function() {
        // this will wake up in case the user canceled the new trainer
        console.log("user canceled new trainer");
    })
  }

  
})