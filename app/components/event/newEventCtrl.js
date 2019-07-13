scheduleApp.controller("newEventCtrl", function($scope, eventSrv, $log, $location, trainerSrv, userSrv, activitySrv, $uibModal) {
    
    // if user is not logged in - go to home
    if (!userSrv.isLoggedIn()) {
        $location.path("/");
        return;
    }

    //moment($(this).val()).add(1,'months').startOf('month').format('M/D/YYYY'));
    
    $scope.eventsFromDb = [];
    
    $scope.event = {};
    $scope.event.name = "";
    $scope.event.day = "";
    $scope.event.type = "";
    $scope.finalSave = false;
    // need special handling 
    $scope.event.startTime = "";
    $scope.event.duration = 0;
    $scope.event.siteId = "";
    $scope.event.isRepeat = false;
    // will we keep the trianer ID in insert???
    //$scope.trainerId = ??
    $scope.event.activityNum = 1;
    $scope.startHourDt = new Date("01/01/1970");
    
    $scope.queryTrainer = "";
    $scope.searchTrainerResults = [];

    $scope.showCal = false;
    $scope.showCalendar = function(){
        $scope.showCal = true;
    }

    $scope.addEvent = function(isFinal) {
        // note - stop sending the day - day will be taken from the event date
        // validate mandatory
        $scope.finalSave = isFinal;
        $scope.event.startTime = $scope.getTimeFromDate($scope.startHourDt);
        $scope.event.duration = parseInt($scope.event.duration);
        $scope.event.activityNum = parseInt($scope.event.activityNum);
                eventSrv.addEvent($scope.event, isFinal).then(function(newEvent) {
                $log.info("new Event was added: " + JSON.stringify(newEvent));
                if ($scope.finalSave) {
                    // go to event list
                    $location.path("/events");
                } else {
                    // go to event details
                    $location.path("/events/" + newEvent.id);
                }
                
        });
    }

    $scope.updateTrainerSearchResults = function(siteId) {
        if (siteId == null || siteId == "" || siteId == undefined)
        {
            alert("Please select site, before searching for trainer");
            return;
        }
        trainerSrv.getTrainersBySite(siteId.toString()).then(function(trainers) {
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
    $scope.openCalendar = function() {  
        $location.path("events/new/map");
    }

    
    $scope.showEventsInCalendar = function() {
        // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
        // const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
        if ($scope.event.startDate == null || $scope.event.startDate == undefined || $scope.event.startDate == "") {
            var startOfMonth = moment().startOf('month').toDate();
            var endOfMonth   = moment().endOf('month').toDate();
        } else {
            var startOfMonth = moment($scope.event.startDate).startOf('month').toDate();
            var endOfMonth   = moment($scope.event.startDate).endOf('month').toDate();
        }
        
        
        activitySrv.getActivitiesByDateRange(startOfMonth, endOfMonth).then( function(activities) {
            $log.info("Following activiites retireved per date rnage: " + JSON.stringify(activities));
            // process the activities and push them to events scope
        
            var modalInstance = $uibModal.open({
                templateUrl: "app/shared/calendar/calendarModal.html",
                controller: "calendarModalCtrl",
                size: 'lg',
                    resolve: {
                    params: function () {
                        return {
                            events: activities,
                            defaultView: 'month'
                        };
                    }
                    }
                });
                
            modalInstance.result.then(function() {
                
                // do nothing
                
            }, function() {
                // this will wake up in case the user close the calendar
                //do nothing 
            });
        }, function(error){
            $log.error(error);
        });
          
    }

    

   /********** needed for time picker */

    $scope.hstep = 1;
    $scope.mstep = 15;



    
})