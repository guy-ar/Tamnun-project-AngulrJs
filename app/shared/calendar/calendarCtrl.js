/** example for define different events and have logic to present it */
// note - all calendars share the same events - in case we need multiple calendars then event source need to be different */


scheduleApp.controller('calendarCtrl',
function($scope, $compile, $timeout, uiCalendarConfig) {
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
  /* event source that calls a function on every view switch */
  // Guy try to hide
  // $scope.eventsF = function (start, end, timezone, callback) {
  //   var s = new Date(start).getTime() / 1000;
  //   var e = new Date(end).getTime() / 1000;
  //   var m = new Date(start).getMonth();
  //   var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
  //   callback(events);
  // };

  // guy try to remove the scope of events
  // $scope.calEventsExt = {
  //    color: '#f00',
  //    textColor: 'yellow',
  //    events: [
  //       {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
  //       {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
  //       {type:'party',title: 'test',start: new Date(y, m, 28),end: new Date(y, m, 29)}
  //     ]
  // };
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
  /* add custom event*/
  $scope.addEvent = function() {
    $scope.events.push({
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame']
    });
  };
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

