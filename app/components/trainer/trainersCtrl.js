scheduleApp.controller("trainersCtrl", function($scope, $log, userSrv) { 

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
  };
})