/** example for define different events and have logic to present it */
// note - all calendars share the same events - in case we need multiple calendars then event source need to be different */


scheduleApp.controller('calendarCtrl',
function($scope, $compile, $timeout, uiCalendarConfig, activitySrv, $log) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

 
  $scope.eventSource = {
          //url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
          className: 'gcal-event',           // an option!
          currentTimezone: 'America/Chicago' // an option!
  };
  /* event source that contains custom events on the scope */
  $scope.events = [
    {id: 0, title: 'All Day Event',start: new Date(y, m, 1)},
    {id: 1, title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}//,
    // the below was example for all day event - and with URL that was removed
    //{title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
  ];
  
// Guy - take big date range - as temp soluition
  $scope.getActivitiesFromDb = function(){
    var current = new Date();
    var nextyear = new Date();
    nextyear.setDate(current.getDate()+365);


    activitySrv.getActivitiesByDateRange(current, nextyear).then( function(activities) {
      $log.info("Following activiites retireved per date rnage: " + JSON.stringify(activities));
      // process the activities and push them to events scope
      $scope.populateEvents(activities);
    }, function(error){

    });
  }

  $scope.populateEvents = function(activities) {
    for (i=0; i< activities.length; i++) {
       
      let startDate = constructDate(activities[i].activityDate, activities[i].activityTime );
      let endDate = constructDate(activities[i].activityDate, activities[i].activityTime, 45 );
      // GUY Need to bring the event attributes as well...id, name, duration
      $scope.addEvent("1111", "Event Title", startDate, endDate, false);
    }
  }

  /* alert on eventClick */
  $scope.alertOnEventClick = function( date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ');
  };
  /* alert on Drop */
   $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
     $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
  };
  /* alert on Resize */
  $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
     $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
  };
  /* add and removes an event source of choice */
  $scope.addRemoveEventSource = function(sources,source) {
    var canAdd = 0;
    angular.forEach(sources,function(value, key){
      if(sources[key] === source){
        sources.splice(key,1);
        canAdd = 1;
      }
    });
    if(canAdd === 0){
      sources.push(source);
    }
  };

  $scope.constructDate = function(dateVal, timeVal, delta){
    let d = dateVal.getDate();
    let m = dateVal.getMonth();
    let y = dateVal.getFullYear();
    let timeArr = timeVal.split(":");
    if (arguments.length > 2)
    {
      // Guy for now just full hour and do not refer to delta
      return new Date(y, m, d, timeArr[0] + 1, timeArr[1]); 

    } else {
      return new Date(y, m, d, timeArr[0], timeArr[1]);
    }
  }

  $scope.prepareDate = function(year, month, day, hour, min){
    return new Date(year, month, day, hour, min);
  }

  /* add event*/
  $scope.addEvent = function(idNum, titleSrc, startDate, endDate, allDayInd) {
    $scope.events.push({
      id: idNum,
      title: titleSrc,
      start: startDate,
      end: endDate,
      allDay: allDayInd
    });
  };
// Guy call events from DB
  $scope.getActivitiesFromDb();
  /* remove event */
  $scope.remove = function(index) {
    $scope.events.splice(index,1);
  };
  /* Change View */
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
      defaultView: 'agendaWeek',
      eventClick: $scope.alertOnEventClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize,
      eventRender: $scope.eventRender
    }
  };

  
  /* event sources array*/
  $scope.eventSources = [$scope.events, $scope.eventSource];
  //$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
  // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

});

