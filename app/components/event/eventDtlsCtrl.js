scheduleApp.controller("eventDtlsCtrl", function($scope, $log, eventSrv, userSrv, $routeParams) {
  
  // if user is not logged in - go to home
  if (!userSrv.isLoggedIn()) {
    $location.path("/");
    return;
}

    // Calling the service to get the event with the key
    // Notice how we are accessing $routeParams.id to get the dynamic part in the URL
    eventSrv.getEventById($routeParams.id).then(function(event) {
      $scope.event = event;
    }, function(err) {
      $log.error(err);
    });
    
  });