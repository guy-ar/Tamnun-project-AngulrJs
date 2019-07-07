scheduleApp.controller("activityEditCtrl", function($scope, $log, activitySrv, userSrv, $routeParams, $location, trainerSrv, utilSrv) {
  
    // if user is not logged in - go to home
    if (!userSrv.isLoggedIn()) {
      $location.path("/");
      return;
    }
  
    // Calling the service to get the activity with the key
    // Notice how we are accessing $routeParams.id to get the dynamic part in the URL
    activitySrv.getActivityById($routeParams.id).then(function(activity) {
      $scope.activity = activity;
      $scope.selectedTrainer = activity.trainerDtls.fname + " " + activity.trainerDtls.lname;
      
  
    }, function(err) {
      $log.error(err);
    });
  
        
    $scope.queryTrainer = "";
  
    
  
    $scope.cancelActivity = function(){
        activitySrv.cancelActivity($scope.activity.id).then( function(result){
        // sucess in cancel the activity
        $log.info("update activity status to be cancelled", result)
        $location.path("/dashboard");
      }, function(err){
        $log.error(err);
  
      });
    }

    
  
    $scope.updateActivityTrainer = function(){
      activitySrv.updateActivityTrainer($scope.activity.id, $scope.activity.trainerId).then( function(result){
        // sucess in update trainer
        $log.info("saved trainer on activity", result)
        $location.path("/dashboard");
      }, function(err){
        $log.error(err);
  
      });
    }
  
    $scope.updateTrainerSearchResults = function() {
      // get all trainers with not filter
      trainerSrv.getTrainers().then(function(trainers) {
          $scope.searchTrainerResults = trainers;
      }, function(err) {
          $log.error(err);
      });
      
  }
  
  $scope.setTrainerForEvent = function(trainer)
  {
      $scope.selectedTrainer = trainer.fname + " " + trainer.lname;
      $scope.activity.trainerId = trainer.id;
  
      $scope.queryTrainer = "";
      $scope.searchTrainerResults = [];
  }
  
  $scope.filterTrainer = function(trainer) {   
      // converting to lower case to do a case insensitive comparison
      if (trainer.fname.toLowerCase().includes($scope.queryTrainer.toLowerCase()) || 
          trainer.lname.toLowerCase().includes($scope.queryTrainer.toLowerCase())) {
          return true;
      } else {
          return false;
      }
  }

  $scope.formatDate = function(date){
    return utilSrv.formatDate(date);
} 
  });