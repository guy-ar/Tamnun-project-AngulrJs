scheduleApp.controller("calendarModalCtrl", function($scope, $timeout, $compile, $log, $uibModalInstance) {
    // guy TODO - might need new service for work hours instead userSrv
    let  params = $scope.$resolve.params;
    $scope.events = [];

    //** to move weekly events for calendar events */
    $scope.populateEvents = function(activities) {
        for (i=0; i< activities.length; i++) {
        
            let startDate = $scope.constructDate(activities[i].activityDate, activities[i].activityTime );
            let endDate = $scope.constructDate(activities[i].activityDate, activities[i].activityTime, 45 );
            
            $scope.addEvent1(activities[i].eventId, activities[i].eventDtls.eventName, startDate, endDate, 
                activities[i].trainerDtls.fname + "-" + activities[i].trainerDtls.lname);
    
        }
    }


    $scope.constructDate = function(dateVal, timeVal, delta){
        let dd = dateVal.getDate();
        let mm = dateVal.getMonth();
        let yy = dateVal.getFullYear();
        let timeArr = timeVal.split(":");
        if (arguments.length > 2)
        {
            // calcualte delta
            var addHour = Math.floor((parseInt(timeArr[1]) + parseInt(delta))/60);
            var addMin = Math.floor((parseInt(timeArr[1]) + parseInt(delta))%60);
            if (addHour > 0) {
                // add to hour and repalce the minutes
                return new Date(yy, mm, dd, parseInt(timeArr[0]) + addHour, addMin); 
            } else {
                // add to minutes and keep the hour
                return new Date(yy, mm, dd, timeArr[0], parseInt(timeArr[1]) + addMin); 
            }
           
        } else {
          return new Date(yy, mm, dd, timeArr[0], timeArr[1]);
        }
    }
    
    $scope.prepareDate = function(year, month, day, hour, min){
        return new Date(year, month, day, hour, min);
    }
    
      /* add event*/
     
    $scope.addEvent1 = function(idNum, titleSrc, startDate, endDate, trainer) {
        $scope.events.push({
        id: idNum,
        title: titleSrc,
        start: startDate,
        end: endDate,
        type: trainer
        //className: ['openSesame']


        });
    };
     
    $scope.view = params.defaultView;

    $scope.populateEvents(params.events);

    $scope.eventSource = {
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
        // Guy TO FIX
    };

    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' Trainer:' + date.type);
    };


    $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
    $timeout(function() {
            if(uiCalendarConfig.calendars[calendar]){
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        });
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                    'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    /* Guy - in order to not allow draggingthe events set the editable to false */
    $scope.uiConfig = {
    calendar:{
        // Guy change it to have the weekly calendar with less scroll
        height: 750,
        editable: true,
        header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
        },
        /* changed the defalut view to week */
        defaultView: $scope.view,
        eventClick: $scope.alertOnEventClick,
        eventRender: $scope.eventRender
    }
    };
        
          
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource];

    $scope.cancelCalendarAction = function() {
           
        $uibModalInstance.dismiss();
    }
   
    
})