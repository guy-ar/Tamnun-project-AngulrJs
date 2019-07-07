scheduleApp.controller("alertsCtrl", function($scope, workHourSrv, $log, userSrv, alertsSrv, $uibModal) {
  $scope.trainer = userSrv.getLoginTrainer();

  $scope.alerts = [];
  // keep alsp the trainer work hours on the Ctrl
  alertsSrv.getAlertsForTrainer($scope.trainer.id).then(function(trainerAlerts) {
      $scope.alerts = trainerAlerts;
      $log.info(JSON.stringify($scope.alerts));

  }, function(err) {
      $log.error(err);
  })

  
  

  $scope.editAlertsModal = function(editAlert) {

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
      for (let i=0; i< alerts.length; i++){
        if (alerts[i].id == alertRes.id)
        {
          alerts[i] = alertRes;
        }
      }
     
    }, function() {
        // this will wake up in case the user canceled the new work hours
        console.log("user canceled edit alert");
    })
  
  }
  

 
  
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
      
      $log.info("need to delete the current trainer not to include the workHours");
      // look for the WH of the relevnt trainer
      
      for (let i=0; i< alerts.length; i++){
        if (alerts[i].id == deleteAlert.id)
        {
          alerts.splice(i, 1);
        }
      }
    
     
    }, function() {
        // this will wake up in case the user canceled the delete alert
        console.log("user canceled delete alert");
    })
  
  }
})

