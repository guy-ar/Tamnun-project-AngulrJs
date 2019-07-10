scheduleApp.controller("trainersCtrl", function($scope, $log, userSrv, trainerSrv, $location, workHourSrv, $uibModal) { 

  $scope.trainers = [];
  //$scope.activeTrainers = null;
  
  $scope.trainersWh = {};

  if (!userSrv.isLoggedIn()) {
    $location.path("/");
    return;
  }
  

  // get the trainers
  trainerSrv.getTrainers().then(function(users) {
    $scope.trainers = users;
  }, function(err) {
    $log.error(err);
  })

  // guy -- not needed anymore
  // keep alsp the trainer work hours on the Ctrl
  // workHourSrv.getTrainersWH().then(function(usersWorkHours) {
  //   $scope.trainersWh = usersWorkHours;
  //   $log.info(JSON.stringify($scope.trainersWh));

  // }, function(err) {
  //   $log.error(err);
  // })

  $scope.query = "";
  $scope.filterSite = "-1";

  $scope.filterTrainer = function(trainer) {    
    // converting to lower case to do a case insensitive comparison
    if (trainer.fname.toLowerCase().includes($scope.query.toLowerCase()) || 
        trainer.lname.toLowerCase().includes($scope.query.toLowerCase())) {
          // check if need to present cancel
          if (($scope.isCancel) && (trainer.state=="Cancel")){
            // check the state
            return false;
          }
          // check if need to filter by site
          if ($scope.filterSite == "-1") {
            return true;
          } else {
            // check if trainer site match the selected site
            if (trainer.siteId == $scope.filterSite){
              return true;
            } else {
              return false;
            }

          }
    } else {
      return false;
    }
  }

// guy not needed anymore
  // $scope.getTrainerWH = function(id) { 
  //   // return the work hours of the specific trainer
  //   let currentWhs = [];
  //   currentWhs = $scope.trainersWh[id];
  //   return currentWhs;
  // }

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

  $scope.openTrainer = function(trainerId) {
    $location.path("/trainer/" + trainerId);
    
  }
})