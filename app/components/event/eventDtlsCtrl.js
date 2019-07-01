scheduleApp.controller("eventDtlsCtrl", function($scope, $log, eventSrv, $routeParams) {
  
    // Calling the service to get the car with the index
    // Notice how we are accessing $routeParams.id to get the dynamic part in the URL
    eventSrv.getEventById($routeParams.id).then(function(event) {
      $scope.event = event;
    }, function(err) {
      $log.error(err);
    });
    
  });