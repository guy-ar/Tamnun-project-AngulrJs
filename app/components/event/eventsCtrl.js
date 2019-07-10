scheduleApp.controller("eventsCtrl", function($scope, $log, $location, userSrv,  eventSrv, utilSrv) { 

  $scope.events = [];
  $scope.filterSite = "-1";


  $scope.isfilterSun=false;
  $scope.isfilterMon=false;
  $scope.isfilterTus=false;
  $scope.isfilterWed=false;
  $scope.isfilterThu=false;
  $scope.isfilterFri=false;
  
  // if user is not logged in - go to home
  if (!userSrv.isLoggedIn()) {
    $location.path("/");
    return;
}

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
          // check if need to present cancel
          if (($scope.isCancel) && (event.state=="Cancel")){
            // check the state
            return false;
          }
          
          // check if need to filter by site
          if ($scope.filterSite == "-1") {
            // check the filter by day
            if (($scope.isfilterSun && event.day == '0') || ($scope.isfilterMon && event.day == '1') ||  ($scope.isfilterTus && event.day == '2')
            || ($scope.isfilterWed && event.day == '3') || ($scope.isfilterThu && event.day == '4') || ($scope.isfilterFri && event.day == '5')
            || (!$scope.isfilterSun && !$scope.isfilterMon && !$scope.isfilterTus && !$scope.isfilterWed && !$scope.isfilterThu && !$scope.isfilterFri)) {
              // day was not selected or selected day match the entry
              return true
                
            }
          } else {
            // check if trainer site match the selected site
            if (event.siteId == $scope.filterSite){
            // check the filter by day
              if (($scope.isfilterSun && event.day == '0') || ($scope.isfilterMon && event.day == '1') ||  ($scope.isfilterTus && event.day == '2')
              || ($scope.isfilterWed && event.day == '3') || ($scope.isfilterThu && event.day == '4') || ($scope.isfilterFri && event.day == '5')
              || (!$scope.isfilterSun && !$scope.isfilterMon && !$scope.isfilterTus && !$scope.isfilterWed && !$scope.isfilterThu && !$scope.isfilterFri)) {
                // day was not selected or selected day match the entry
                return true
                  
              }
            } else {
              return false;
            }

          }
    } else {
      return false;
    }
  }

  $scope.openEvent = function(event) {
    $location.path("/events/" + event.id);
    
  }

  $scope.formatDate = function(date) {
    return utilSrv.formatDate(date);
    
  }
  //  will not be in use - switch to full screen mode

  $scope.formatEventType = function(type) {
    if (type == "1") {
      return "Private Lesson";
    } else {
      return "Group Class";
    }
    
  }

  $scope.formatDayOfWeek = function(day){
    switch (day) {
      case 0:
        return "Sunday";

      case 1:
        return "Monday";

      case 2:
        return "Tuesday";

      case 3:
        return "Wednesday";

      case 4:
        return "Thursday";

      case 5:
        return "Friday";

      case 6:
        return "Saturday";
      
      default:
        return day;
    }
  }
})