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


    /************************************************************************************************ */
    $scope.today = function() {
        $scope.dt = new Date();
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
    
    
      /*var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];*/
    
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
})