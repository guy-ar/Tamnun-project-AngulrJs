scheduleApp.controller("weeklyEventsCtrl", function($scope, $log, userSrv, activitySrv, $uibModal) {
  
    $scope.weeklyEvents = [];
    $scope.trainer = userSrv.getLoginTrainer();

    $scope.getSunday = function(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day; 
        return new Date(d.setDate(diff));
    }

    $scope.getSuturday = function(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + 6; 
        return new Date(d.setDate(diff));
    }

    $scope.showPrevWeek = function() {
        //update startDay and endDay to present a week before
        let diff =  $scope.startDay.getDate() - 7;
        $scope.startDay.setDate(diff);
        diff =  $scope.endDay.getDate() - 7;
        $scope.endDay.setDate(diff);
        $scope.startDayStr = moment($scope.startDay).format('DD-MM-YYYY');
        $scope.endDayStr = moment($scope.endDay).format('DD-MM-YYYY');
        return;
    }

    $scope.showNextWeek = function() {
        //update startDay and endDay to present a week before
        let diff =  $scope.startDay.getDate() + 7;
        $scope.startDay.setDate(diff);
        diff =  $scope.endDay.getDate() + 7;
        $scope.endDay.setDate(diff);
        $scope.startDayStr = moment($scope.startDay).format('DD-MM-YYYY');
        $scope.endDayStr = moment($scope.endDay).format('DD-MM-YYYY');
        return;
    }

    $scope.nextWeek = function(){
        return;
    }
    
    $scope.startDay = $scope.getSunday(new Date());
    $scope.startDayStr = moment($scope.startDay).format('DD-MM-YYYY');
    $scope.endDay = $scope.getSuturday(new Date());
    $scope.endDayStr = moment($scope.endDay).format('DD-MM-YYYY');

    $scope.formatDate = function(date){
        return moment(date).format('DD-MM-YYYY')
    }
    //$scope.week = new Date().moment().format('W');

    //2019-W28

    

    $scope.showEvents = function(){
        $scope.weeklyEvents = [];
        // get the events per selected week
    

        activitySrv.getActivitiesAndEventByTrainer($scope.trainer.id, $scope.startDay, $scope.endDay).then(function(result){
            $log.info(JSON.stringify(result));
            $scope.weeklyEvents = result;

        }, function(error){
            $log.error(error);

        });
        

    }

    $scope.showEvents();

    
})