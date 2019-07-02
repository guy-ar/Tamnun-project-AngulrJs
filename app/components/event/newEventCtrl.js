scheduleApp.controller("newEventCtrl", function($scope, eventSrv, $log, $location, trainerSrv) {
    $scope.event = {};
    $scope.event.name = "";
    $scope.event.day = "";
    $scope.event.type = "";
    // need special handling 
    $scope.event.startTime = "";
    $scope.event.duration = 0;
    $scope.event.siteId = "";
    $scope.event.isRepeat = false;
    // will we keep the trianer ID in insert???
    //$scope.trainerId = ??
    $scope.event.activityNum = 0;
    $scope.startHourDt = new Date("01/01/1970");
    
    $scope.queryTrainer = "";
    $scope.searchTrainerResults = [];

    $scope.addEvent = function() {
        // note - stop sending the day - day will be taken from the event date
        // validate mandatory
        $scope.event.startTime = $scope.getTimeFromDate($scope.startHourDt);
        $scope.event.duration = parseInt($scope.event.duration);
        $scope.event.activityNum = parseInt($scope.event.activityNum);
        // eventSrv.addEvent($scope.name, $scope.day, $scope.type, $scope.getTimeFromDate($scope.startHourDt), parseInt($scope.duration), $scope.siteId, 
            // $scope.isRepeat, $scope.trainerId, parseInt($scope.activityNum)).then(function(newEvent) {
        eventSrv.addEvent($scope.event).then(function(newEvent) {
                $log.info("new Event was added: " + JSON.stringify(newEvent));
                $location.path("/events/" + newEvent.id);
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
    $scope.openCalendar = function() {  
        $location.path("events/new/map");
    }

    

    

   /********** needed for time picker */

    $scope.hstep = 1;
    $scope.mstep = 15;



    /*************************** This logic belong to Date Picker */
    $scope.today = function() {
        $scope.startDate = new Date();
    };
    $scope.today();
    
    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: false
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        // if to start on Sunday on on monday
        startingDay: 0
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        return mode === 'day' && date.getDay() === 6;
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open = function() {
        $scope.popup.opened = true;
    };

    

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
    $scope.format = 'dd-MMMM-yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup = {
        opened: false
    };


    function getDayClass(data) {
    var date = data.date,
        mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
    /************ Generic logic for time picker - to move to generic script */
    // logic to insure that hours retrieved from date will be set on valid formet
    $scope.addZero = function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    // test fuction for setting the hours and minutes from date
    $scope.getTimeFromDate  = function(dateObj) {
        
        var time = "";
        var h = $scope.addZero(dateObj.getHours());
        var m = $scope.addZero(dateObj.getMinutes());
        time = h + ":" + m;
        return time;
    }
})