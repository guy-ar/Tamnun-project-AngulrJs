scheduleApp.controller("alertsCtrl", function($scope, $log, userSrv, alertSrv, utilSrv, $location, $uibModal) {
  $scope.trainer = userSrv.getLoginTrainer();

  $scope.alerts = [];

  // if user is not logged in - go to home
  if (!userSrv.isLoggedIn()) {
    $location.path("/");
    return;
  }

  // keep alsp the trainer work hours on the Ctrl
  alertSrv.getAlertsForTrainer($scope.trainer.id).then(function(trainerAlerts) {
      $scope.alerts = trainerAlerts;
      $log.info(JSON.stringify($scope.alerts));

  }, function(err) {
      $log.error(err);
  })

  
  

  $scope.editAlertModal = function(editAlert) {

    var modalInstance = $uibModal.open({
        templateUrl: "app/components/alert/alertEdit.html",
        controller: "alertEditCtrl",
        resolve: {
          params: function () {
            return {
              alert: editAlert
            };
          }
        }
    });
    
    modalInstance.result.then(function(alertRes) {
      
      // look for the Alert 
      for (let i=0; i< $scope.alerts.length; i++){
        if ($scope.alerts[i].id == alertRes.id)
        {
          $scope.alerts[i] = alertRes;
          break;
        }
      }
     
    }, function() {
        // this will wake up in case the user canceled the new work hours
        console.log("user canceled edit alert");
    })
  
  }
  
  $scope.$on('alertCreatedEvent', function(event, data) { 
    console.log("New Alert was created: " + data); 
    $scope.alerts.push(data);
    // need to clean the rootscope - how???

  });
 
  
  $scope.deleteAlertModal = function(alert) {

    var modalInstance = $uibModal.open({
        templateUrl: "app/components/alert/alertCancel.html",
        controller: "alertCancelCtrl",
        resolve: {
          params: function () {
            return {
              alert: alert
            };
          }
        }
    });
    
    modalInstance.result.then(function(deleteAlert) {
      
      $log.info("need to delete the current alert");
      // look for the WH of the relevnt trainer
      
      for (let i=0; i< $scope.alerts.length; i++){
        if ($scope.alerts[i].id == deleteAlert.id)
        {
          $scope.alerts.splice(i, 1);
          break;
        }
      }
    
     
    }, function() {
        // this will wake up in case the user canceled the delete alert
        console.log("user canceled delete alert");
    })
  
  }

  $scope.formatDate = function(date){
    return utilSrv.formatDate(date);
  }
})

