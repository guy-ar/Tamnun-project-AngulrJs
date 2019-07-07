scheduleApp.factory("alertSrv", function($q, $log) {
    const STATE_ACTIVE = "Active";
    const STATE_HANDLED = "Handled";
    
    function Alert(plainAlertOrId, trainerId, activityId, name, description, state, resolutionDtls, resolutionType) {
        if (arguments.length > 1) {
            this.id = plainAlertOrId;            
            this.trainerId = trainerId;
            this.activityId = activityId;
            this.name = name;
            this.description = description;
            this.state = state;
            this.resolutionDtls = resolutionDtls;
            this.resolutionType = resolutionType;
            
        } else {
            this.id = plainAlertOrId.id;
            if (plainAlertOrId.get("trainerId") != null){
                this.trainerId = plainAlertOrId.get("trainerId").id;
                this.trainerDtls = {};
                this.trainerDtls.userName = plainAlertOrId.get("trainerId").get("userName");
                this.trainerDtls.fname = plainAlertOrId.get("trainerId").get("fname");
                this.trainerDtls.lname = plainAlertOrId.get("trainerId").get("lname");
            }
            if (plainAlertOrId.get("activityId") != null){
                this.activityId = plainAlertOrId.get("activityId").id;
            }
            this.name = plainAlertOrId.get("name");
            this.description = plainAlertOrId.get("description");
            this.state = plainAlertOrId.get("state");
            this.resolutionDtls = plainAlertOrId.get("resolutionDtls");
            this.resolutionType = plainAlertOrId.get("resolutionType");
            if (plainAlertOrId.get("activityId") != null){
                this.activityDtls = {};
                this.activityDtls.activityName = plainAlertOrId.get("activityId").get("name");
                this.activityDtls.activityDate = plainAlertOrId.get("activityId").get("activityDate");
                this.activityDtls.activityTime = plainAlertOrId.get("activityId").get("activityTime");
            }
        }
    }
    
    function createAlert(trainerId, activityId, alertName, description) {

        var async = $q.defer(); 
        $log.info("Create Alert call");

        let trainer = null;
        let activity = null;
        

        // Preparing the new parse event object to save
        const AlertObj = Parse.Object.extend('Alert');
        const myNewObject = new AlertObj();

        if (trainerId!=null && trainerId!=undefined && trainerId!=""){
            trainer = new Parse.Object("Trainer");
            trainer.id =  trainerId;
            myNewObject.set('trainerId', trainer);
        }
       
        
        activity = new Parse.Object("Activity");
        activity.id =  activityId;
        myNewObject.set('activityId', activity);
        
        
        myNewObject.set('state', STATE_ACTIVE);
        
        
        myNewObject.set('name', alertName);
        myNewObject.set('description', description);



        myNewObject.save().then(
            (result) => {
                async.resolve(new Alert(result));
                // call to activitySrv in order to create the instances per event

                console.log('Alert was added', result);
            }).catch(error => {
                console.error('Error while create alert', error);
                async.reject(error);
            });
        
        return async.promise;
    

    }

    // get alerts that match the trainer
    function getAlertsForTrainer(trainerId){
        var async = $q.defer(); 
        let alerts = [];
        $log.info("get Alert for trainer call");

        let trainer = null;
                

        // Preparing the new parse event object to save
        const AlertObj = Parse.Object.extend('Alert');
        const myNewObject = new AlertObj();

        
        trainer = new Parse.Object("Trainer");
        trainer.id =  trainerId;
        const query = new Parse.Query(myNewObject);
       
        query.equalTo("trainerId", trainer);

        query.include("activityId");

        query.find().then((results) => {
            console.log('Alerts found for trainer', results);
            for (let index = 0; index < results.length; index++) {
                alerts.push(new Alert(results[index]));
            }
            async.resolve(alerts);
        }, (error) => {
            console.error('Error while fetching alerts by trainer', error);
            async.reject(error);
        });
        return async.promise;

    }

    // get alerts that match the trainer
    function getOpenAlertsForAll(){
        var async = $q.defer(); 
        let alerts = [];
        $log.info("get Alert for trainer call");               

        // Preparing the new parse event object to save
        const AlertObj = Parse.Object.extend('Alert');
        const myNewObject = new AlertObj();

        
        const query = new Parse.Query(myNewObject);
       
        query.equalTo("state", STATE_ACTIVE);

        query.include("activityId");
        query.include("trainerId");

        query.find().then((results) => {
            console.log('Alerts found for trainer', results);
            for (let index = 0; index < results.length; index++) {
                alerts.push(new Alert(results[index]));
            }
            async.resolve(alerts);
        }, (error) => {
            console.error('Error while fetching alerts for all', error);
            async.reject(error);
        });
        return async.promise;

    }


    function editAlertByTrainer(id, alertName, description){
        let  async = $q.defer();
        const AlertObj = Parse.Object.extend('Alert');
        const query = new Parse.Query(AlertObj);
        query.include("activityId");

        // Finds the Event by its ID
        query.get(id).then((object) => {
            // Updates the event dtls
            object.set('name', alertName);
            object.set('description', description);
            
            // Saves the alert with the updated data
            object.save().then((response) => {
                console.log('Updated alert details', response);
                async.resolve(new Alert(response));
            }).catch((error) => {
                console.error('Error while updating alert details', error);
            });
        });
        return async.promise;

    }

    function editAlertByAdmin(id, resolutionType, resolution, isHandled) {
        let  async = $q.defer();
        const AlertObj = Parse.Object.extend('Alert');
        const query = new Parse.Query(AlertObj);
        query.include("activityId");

        // Finds the Event by its ID
        query.get(id).then((object) => {
            // Updates the event dtls
            object.set('resolutionType', resolutionType);
            object.set('resolutionDtls', resolution);
            if (isHandled) {
                object.set('state', STATE_HANDLED);
            }
            
            // Saves the alert with the updated data
            object.save().then((response) => {
                console.log('Updated alert details', response);
                async.resolve(new Alert(response));
            }).catch((error) => {
                console.error('Error while updating alert details', error);
            });
        });
        return async.promise;
    }

    function deleteAlert(id) {
        let  async = $q.defer();
        const AlertObj = Parse.Object.extend('Alert');
        const query = new Parse.Query(AlertObj);
        // here you put the objectId that you want to delete
        query.get(id).then((object) => {
            object.destroy().then((response) => {
                console.log('Deleted Alert', response);
                async.resolve(response);
            }, (error) => {
        
                console.error('Error while deleting Alert', error);
            });
        });


        return async.promise;
    }

    return {
        createAlert: createAlert,
        getAlertsForTrainer: getAlertsForTrainer, 
        editAlertByTrainer: editAlertByTrainer,
        deleteAlert: deleteAlert,
        getOpenAlertsForAll: getOpenAlertsForAll,
        editAlertByAdmin: editAlertByAdmin
    }
});