scheduleApp.controller("weeklyEventsCtrl", function($scope, $log, userSrv, activitySrv, utilSrv, $rootScope, $uibModal, $routeParams, $location) {
  
    $scope.weeklyEvents = [];
    $scope.trainer = userSrv.getLoginTrainer();
    $scope.isAdmin = userSrv.isLoggedAdmion();
    $scope.isTrainer = userSrv.isLoggedTrainer();

    $scope.calEevents = [];

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
    
    $scope.startDay = $scope.getSunday(new Date());
    $scope.startDayStr = moment($scope.startDay).format('DD-MM-YYYY');
    $scope.endDay = $scope.getSuturday(new Date());
    $scope.endDayStr = utilSrv.formatDate($scope.endDay);

    $scope.formatDate = function(date){
        return utilSrv.formatDate(date);
    }
    
    

    $scope.showEvents = function(){
        $scope.weeklyEvents = [];
        // get the events per selected week
        if ($scope.isTrainer){
            activitySrv.getActivitiesAndEventByTrainer($scope.trainer.id, $scope.startDay, $scope.endDay).then(function(result){
                $log.info(JSON.stringify(result));
                $scope.weeklyEvents = result;
                

            }, function(error){
                $log.error(error);

            });
        } else if ($scope.isAdmin){
            // need to check if the page is trainer dtls - so only trainer hours will be presetned
            // else hours for all trainers will be presennted

            var location = $location.path();
            if (location == "/dashboard") {
                // need to retrieve events for all trainers
                        
                activitySrv.getActivitiesAndEventForAll($scope.startDay, $scope.endDay).then(function(result){
                    $log.info(JSON.stringify(result));
                    $scope.weeklyEvents = result;

                }, function(error){
                    $log.error(error);

                });
            } else if (location.substring(0,9) =='/trainer/') {
                //get WH for specific trainer
                var id = $routeParams.id;
                activitySrv.getActivitiesAndEventByTrainer(id, $scope.startDay, $scope.endDay).then(function(result){
                    $log.info(JSON.stringify(result));
                    $scope.weeklyEvents = result;
    
                }, function(error){
                    $log.error(error);
    
                });
            }
        }
        

    }

    $scope.showEvents();

    $scope.addAlertModal = function(activity) {
        var modalInstance = null;
        
        if ($scope.isTrainer) {

            modalInstance = $uibModal.open({
                templateUrl: "app/components/alert/alertNew.html",
                controller: "alertNewCtrl",
                resolve: {
                params: function () {
                    return {
                    uId: $scope.trainer.id,
                    activity: activity
                    };
                }
                }
            });
            
            modalInstance.result.then(function(newAlert) {
            $log.info("need to send the new alert to the dashboard - HOW???");
            // Guy to ask how to do it - send messages between controllers
            $rootScope.$broadcast('alertCreatedEvent', newAlert);
            //$scope.$emit('alertCreatedEvent', newAlert);
            
            }, function() {
                // this will wake up in case the user canceled the new work hours
                console.log("user canceled add alert");
            })
        } else if ($scope.isAdmin) {
            modalInstance = $uibModal.open({
                templateUrl: "app/components/alert/alertNew.html",
                controller: "alertNewCtrl",
                resolve: {
                params: function () {
                    return {
                        activity: activity
                    };
                }
                }
            });
            
            modalInstance.result.then(function(newAlert) {
            $log.info("need to send the new alert to the dashboard - HOW???");
            // Guy to ask how to do it - send messages between controllers
            $rootScope.$broadcast('alertCreatedEvent', newAlert);
            //$scope.$emit('alertCreatedEvent', newAlert);
            
            }, function() {
                // this will wake up in case the user canceled the new work hours
                console.log("user canceled add alert");
            })
        }
    } 

    $scope.showEventsInCalendar = function() {
    
        var modalInstance = $uibModal.open({
            templateUrl: "app/shared/calendar/calendarModal.html",
            controller: "calendarModalCtrl",
            size: 'lg',
                resolve: {
                  params: function () {
                    return {
                        events: $scope.weeklyEvents,
                        defaultView: 'agendaWeek',
                        startDateStr: moment($scope.startDay).format('YYYY-MM-DD')
                    };
                  }
                }
            });
            
        modalInstance.result.then(function(alertRes) {
            
            // do nothing
            
        }, function() {
            // this will wake up in case the user close the calendar
            //do nothing 
        });
          
    }

})