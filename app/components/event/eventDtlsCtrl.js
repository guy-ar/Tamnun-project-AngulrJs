scheduleApp.controller("eventDtlsCtrl", function($scope, $log, eventSrv, userSrv, $routeParams, $location, trainerSrv) {
  
  // if user is not logged in - go to home
  if (!userSrv.isLoggedIn()) {
    $location.path("/");
    return;
  }

  // Calling the service to get the event with the key
  // Notice how we are accessing $routeParams.id to get the dynamic part in the URL
  eventSrv.getEventById($routeParams.id).then(function(event) {
    $scope.event = event;
    $scope.startHourDt = new Date($scope.setTimeFromStr($scope.event.startTime).getTime());
    // need to set the hour based on $scope.event.startTime
    $scope.selectedTrainer = event.trainerDtls.fname + " " + event.trainerDtls.lname;
    $scope.event.trainerId = event.trainerId;

  }, function(err) {
    $log.error(err);
  });

  $scope.hstep = 1;
  $scope.mstep = 15;
  
  $scope.queryTrainer = "";

  

  $scope.updateEventDtls = function(){
    $scope.event.duration = parseInt($scope.event.duration);
    $scope.event.startTime = $scope.getTimeFromDate($scope.startHourDt);
    $scope.event.activityNum = parseInt($scope.event.activityNum);
    eventSrv.updateEventDtls($scope.event).then( function(result){
      // sucess in update trainer
      $log.info("saved trainer on event", result)
      $location.path("/events");
    }, function(err){
      $log.error(err);

    });
  }

  $scope.updateEventTrainer = function(){
    eventSrv.updateEventTrainer($scope.event.id, $scope.event.trainerId).then( function(result){
      // sucess in update trainer
      $log.info("saved trainer on event", result)
      $location.path("/events");
    }, function(err){
      $log.error(err);

    });
  }

  $scope.updateTrainerSearchResults = function(siteId) {
    if (siteId == null || siteId == "" || siteId == undefined)
    {
        alert("Please select site, before searching for trainer");
        return;
    }
    trainerSrv.getTrainersBySite(siteId).then(function(trainers) {
        $scope.searchTrainerResults = trainers;
    }, function(err) {
        $log.error(err);
    });
    
}

$scope.setTrainerForEvent = function(trainer)
{
    $scope.selectedTrainer = trainer.fname + " " + trainer.lname;
    $scope.event.trainerId = trainer.id;

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
});