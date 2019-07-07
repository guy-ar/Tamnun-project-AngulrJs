scheduleApp.controller("eventsCtrl", function($scope, $log, $location, userSrv,  eventSrv, utilSrv) { 

  $scope.events = [];
  
  // if user is not logged in - go to home
  if (!userSrv.isLoggedIn()) {
    $location.path("/");
    return;
}

  // get the trainers
  eventSrv.getEvents().then(function(events) {
    $scope.events = events;
  }, function(err) {
    $log.error(err);
  })

 
  $scope.query = "";
  // need to filter only by event name but support also filter by satate and date range
  // not ready
  $scope.filterEvent = function(event) {    
    // converting to lower case to do a case insensitive comparison
    if (event.name.toLowerCase().includes($scope.query.toLowerCase()) ) {
          // check if need to filter by state
          /*if (($scope.isCancel) && (trainer.state=="Cancel")){
            // check the state
            return false;
          }*/
          // check if need to filter by date range
          //TODO
      return true;
    } else {
      return false;
    }
  }

  $scope.openEvent = function(event) {
    $location.path("/events/" + event.id);
    
  }

  $scope.formatDate = function(date) {
    return utilSrv.formatDate(date);
    
  }
  //  will not be in use - switch to full screen mode

  $scope.formatEventType = function(type) {
    if (type == "1") {
      return "Private Lesson";
    } else {
      return "Group Class";
    }
    
  }

})