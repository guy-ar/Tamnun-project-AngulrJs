scheduleApp.factory("alertSrv", function($q, $log) {
    const STATE_ACTIVE = "Active";
    
    function Alert(plainActivityOrId, trainerId, activityId, name, description, state, resolutionDtls, resolutionType) {
        if (arguments.length > 1) {
            this.id = plainActivityOrId;            
            this.trainerId = trainerId;
            this.activityId = activityId;
            this.name = name;
            this.description = description;
            this.state = state;
            this.resolutionDtls = resolutionDtls;
            this.resolutionType = resolutionType;
            
        } else {
            this.id = plainActivityOrId.id;
            if (plainActivityOrId.get("trainerId") != null){
                this.trainerId = plainActivityOrId.get("trainerId").id;
            }
            if (plainActivityOrId.get("activityId") != null){
                this.activityId = plainActivityOrId.get("activityId").id;
            }
            this.name = plainActivityOrId.get("name");
            this.description = plainActivityOrId.get("description");
            this.state = plainActivityOrId.get("state");
            this.resolutionDtls = plainActivityOrId.get("resolutionDtls");
            this.resolutionType = plainActivityOrId.get("resolutionType");
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

        
        trainer = new Parse.Object("Trainer");
        trainer.id =  trainerId;
        myNewObject.set('trainerId', trainer);
       
        
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

    return {
        createAlert: createAlert
    }
});