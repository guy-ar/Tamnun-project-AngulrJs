scheduleApp.controller("newEditEventCtrl", function($scope, eventSrv, $log, $uibModalInstance) {
    let  params = $scope.$resolve.params;
    $scope.mode = params.mode;

    if ( $scope.mode == "I") {
        $scope.name = "";
        $scope.day = "";
        $scope.type = "";
        // need special handling 
        //$scope.startTime = "";
        $scope.duration = 0;
        $scope.siteId = "";
        $scope.isRepeat = "";
        // will we keep the trianer ID in insert???
        //$scope.trainerId = ??
        $scope.activityNum = 0;
    } else if ( $scope.mode == "U"){
        $scope.id = params.event.id;
        $scope.name = params.event.name;
        $scope.day = params.event.day;
        $scope.type = params.event.type;
        // need special handling 
        //$scope.startTime = params.event.startTime;
        $scope.duration = params.event.duration;
        $scope.siteId = params.event.siteId;
        $scope.isRepeat = params.event.isRepeat;
        $scope.activityNum = params.activityNum.isRepeat;
    
    } else {
        // error occured - do not continue
        return;
    }
    $scope.addEvent = function() {
        eventSrv.addEvent($scope.name, $scope.day, $scope.type, $scope.startTime, $scope.duration, $scope.siteId, 
                            $scope.isRepeat, $scope.trainerId, $scope.activityNum).then(function(newEvent) {
            $log.info("new Event was added: " + JSON.stringify(newEvent));
            // Closing the modal
            $uibModalInstance.close(newEvent);
       });
    }

    $scope.cancelEventAction = function() {
        $scope.id = "";
        $scope.name = "";
        $scope.day = "";
        $scope.type = "";
        // need special handling 
        //$scope.startTime = "";
        $scope.duration = "";
        $scope.siteId = "";
        $scope.isRepeat = "";
        // will we keep the trianer ID in insert???
        //$scope.trainerId = ??
        $scope.activityNum = "";
        $uibModalInstance.dismiss();
    }

    $scope.editEvent = function() {
        eventSrv.updateEventDtls($scope.id, $scope.name, $scope.day, $scope.type, $scope.startTime, $scope.duration,
             $scope.siteId, $scope.isRepeat , $scope.activityNum).then(function(updateEvent) {
            $log.info("Event was updated: " + JSON.stringify(updateEvent));
            
            // Closing the modal
            $uibModalInstance.close(updateEvent);
       });
    }

})