scheduleApp.factory("activitySrv", function($q, $log) {
    
    const STATE_ACTIVE = "Active";
    const STATE_CANCEL = "Cancel";
    const STATE_TENTATIVE = "Tentative";

    function Activity(plainActivityOrId, eventId, comments, activityDate, state, trainerId, eventDtls) {
        if (arguments.length > 1) {
            this.id = plainActivityOrId;            
            this.eventId = eventId;
            this.comments = comments;
            this.state = state;
            this.trainerId = trainerId;
            this.activityDate = activityDate;
            this.activityTime = activityTime
            
        } else {
            this.id = plainActivityOrId.id;
            
            this.eventId = plainActivityOrId.get("eventId").id;
            this.comments = plainActivityOrId.get("comments");
            this.state = plainActivityOrId.get("state");
            if (plainActivityOrId.get("trainerId") != null){
                this.trainerId = plainActivityOrId.get("trainerId").id;
            }
            this.activityDate = plainActivityOrId.get("activityDate");
            this.activityTime = plainActivityOrId.get("activityTime");
            this.activityName = plainActivityOrId.get("name");
            if (plainActivityOrId.get("eventId") != null){
                this.eventDtls = {};
                this.eventDtls.eventName = plainActivityOrId.get("eventId").get("name");
                this.eventDtls.eventDuration = plainActivityOrId.get("eventId").get("duration");
                this.eventDtls.eventState = plainActivityOrId.get("eventId").get("state");
            }

        }
    }

    function createAllActivityforEvent(eventInputObj){
        var async = null;
        // call createActivityforEvent for each instance of requested activity
        $log.info("Create Activities call");
        var current = new Date();
        current.setDate(eventInputObj.startDate.getDate())
        
        for (i=0; i<eventInputObj.activityNum ;i++ )
        {
            nextWeek = new Date();
            nextWeek.setDate(current.getDate()+i*7);
            
            async = $q.defer(); 
            $log.info("lop with activity on :" + eventInputObj.startDate);
            createActivityforEvent(eventInputObj, nextWeek).then(function (actResult){

                
                // meanwhile create the activities for the event - assume no error will be done
                $log.info('activity was added', JSON.stringify(actResult));
            }, 
            function (error) {
              console.error('Error while creating activity: ', error);
              async.reject(error);
            });

        }
        return async.promise;

    }
    function createActivityforEvent(eventInputObj, targetDate){
        

        var async = $q.defer(); 
        $log.info("Create ActivitForEvent call");

        let trainer = null;
        let event = null;
        

        // Preparing the new parse event object to save
        const ActivityObj = Parse.Object.extend('Activity');
        const myNewObject = new ActivityObj();

        if (eventInputObj.trainerId != undefined) {
            trainer = new Parse.Object("Trainer");
            trainer.id =  eventInputObj.trainerId;
            myNewObject.set('trainerId', trainer);
        }
        if (eventInputObj.id != undefined) {
            event = new Parse.Object("Event");
            event.id =  eventInputObj.id;
            myNewObject.set('eventId', event);
        }
        
        myNewObject.set('state', STATE_ACTIVE);
        myNewObject.set('name', eventInputObj.name);
        
        myNewObject.set('activityTime', eventInputObj.startTime);
        myNewObject.set('activityDate', targetDate);



        myNewObject.save().then(
            (result) => {
                async.resolve(new Activity(result));
                // call to activitySrv in order to create the instances per event

                console.log('Activity was added', result);
            }).catch(error => {
                console.error('Error while create activity', error);
                async.reject(error);
            });
        
        return async.promise;
    }

    function getActivitiesByDateRange(minDate, maxDate) {
        let activities = [];
        let async = $q.defer(); 
        const ActivityObj = Parse.Object.extend('Activity');
        const query = new Parse.Query(ActivityObj);
        
        query.greaterThanOrEqualTo("activityDate", minDate);
        query.lessThanOrEqualTo("activityDate", maxDate);
        query.find().then(function(results) {
            console.log('Activity found', results);
            for (let index = 0; index < results.length; index++) {
                activities.push(new Activity(results[index]));
            }
            async.resolve(activities);
        }, function(error) {
            console.error('Error while fetching Activity', error);
            async.reject(error);
        
        });
        return async.promise;

    }

    function getActivitiesAndEventByTrainer(trainerId, effDate, expDate) {
        let eventActivities = [];
        let async = $q.defer(); 
        
        const ActivityObj = new Parse.Object("Activity");
        const queryActByTrainer = new Parse.Query(ActivityObj);


        const TrainerObj = new Parse.Object("Trainer");
        TrainerObj.id = trainerId;
        queryActByTrainer.equalTo("trainerId", TrainerObj);
        queryActByTrainer.greaterThanOrEqualTo("activityDate", effDate);
        queryActByTrainer.lessThanOrEqualTo("activityDate", expDate);
       
        queryActByTrainer.include("eventId");

        
        queryActByTrainer.find().then(function(results) {
            // build activity entity + related linked event
            for (let index = 0; index < results.length; index++) {
                eventActivities.push(new Activity(results[index]));
            }
            async.resolve(eventActivities);

        
        }, function(error){
            console.error('Error while fetching Activity', error);
            async.reject(error);
        });

        return async.promise;

    }

    function getActivitiesAndEventForAll(effDate, expDate) {
        let eventActivities = [];
        let async = $q.defer(); 
        
        const ActivityObj = new Parse.Object("Activity");
        const queryActByTrainer = new Parse.Query(ActivityObj);

        queryActByTrainer.greaterThanOrEqualTo("activityDate", effDate);
        queryActByTrainer.lessThanOrEqualTo("activityDate", expDate);
       
        queryActByTrainer.include("eventId");

        
        queryActByTrainer.find().then(function(results) {
            // build activity entity + related linked event
            for (let index = 0; index < results.length; index++) {
                eventActivities.push(new Activity(results[index]));
            }
            async.resolve(eventActivities);

        
        }, function(error){
            console.error('Error while fetching Activity', error);
            async.reject(error);
        });

        return async.promise;

    }
    


    return {
        createActivityforEvent: createActivityforEvent,
        createAllActivityforEvent: createAllActivityforEvent, 
        getActivitiesByDateRange: getActivitiesByDateRange,
        getActivitiesAndEventByTrainer: getActivitiesAndEventByTrainer, 
        getActivitiesAndEventForAll: getActivitiesAndEventForAll
    }
});
