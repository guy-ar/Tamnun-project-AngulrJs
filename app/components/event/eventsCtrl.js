scheduleApp.controller("eventsCtrl", function($scope, $log, trainerSrv, eventSrv, $uibModal) { 

  $scope.events = [];
  

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

  
  $scope.openNewEventModal = function() {
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/event/eventNewEdit.html",
        controller: "newEditEventCtrl",
        resolve: {
          params: function () {
            return {
              mode: "I"
            };
          }
        }
    });

    modalInstance.result.then(function(newEvent) {
        // this will wake in case the user added a new event
        $scope.events.push(newEvent);
        
    }, function() {
        // this will wake up in case the user canceled the new event addition
        console.log("user canceled add event");
    })
  }

  $scope.openEditEventModal = function(event) {
    
    var modalInstance = $uibModal.open({
        templateUrl: "app/components/event/eventNewEdit.html",
        controller: "newEditEventCtrl",
        resolve: {
          params: function () {
            return {
              mode: "U",
              event: event
            };
          }
        }
    });

    modalInstance.result.then(function(editEvent) {
        $log.info("need to update the current event");
        // this will wake in case the user updated an event
        for (let i = 0; i < $scope.events.length; i++)
        {
          if ($scope.events[i].id == editEvent.id) {
            $scope.events[i] = editEvent;
          }
        }
        
    }, function() {
        // this will wake up in case the user canceled the new event
        console.log("user canceled edit event");
    })
  }

})