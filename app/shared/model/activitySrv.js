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
                this.trainerDtls = {};
                this.trainerDtls.userName = plainActivityOrId.get("trainerId").get("userName");
                this.trainerDtls.fname = plainActivityOrId.get("trainerId").get("fname");
                this.trainerDtls.lname = plainActivityOrId.get("trainerId").get("lname");
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
        current = eventInputObj.startDate;
        
        var dateCopy = new Date(current.getTime());
        
        for (i=0; i<eventInputObj.activityNum ;i++ )
        {   
            var nextWeek = new Date(current.getTime());
            nextWeek.setDate(dateCopy.getDate()+i*7);
            
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
        if (arguments.length > 1) {
            query.lessThanOrEqualTo("activityDate", maxDate);
        }
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
        queryActByTrainer.include("trainerId");

        
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
        const queryActByAll = new Parse.Query(ActivityObj);

        queryActByAll.greaterThanOrEqualTo("activityDate", effDate);
        queryActByAll.lessThanOrEqualTo("activityDate", expDate);
       
        queryActByAll.include("eventId");
        queryActByAll.include("trainerId");
        
        queryActByAll.find().then(function(results) {
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
    
    function cancelActivity(id) {
        let  async = $q.defer();
        const ActivityObj = Parse.Object.extend('Activity');
        const query = new Parse.Query(ActivityObj);

        // Finds the activity by its ID
        query.get(id).then((object) => {
            // Updates the activity status
            
            object.set('state', STATE_CANCEL);

            // Saves the activity with the updated data
            object.save().then((response) => {
                console.log('Updated status on activity', response);
                async.resolve(new Activity(response));
            }).catch((error) => {
                console.error('Error while updating activity status', error);
            });
        });
        return async.promise;
    }

    function updateActivityTrainer(id, trainerId){
        let  async = $q.defer();
        const ActivityObj = Parse.Object.extend('Activity');
        const query = new Parse.Query(ActivityObj);

        // Finds the Activity by its ID
        query.get(id).then((object) => {
            // Updates the trainer ID
            let trainer = new Parse.Object("Trainer");
            trainer.id =  trainerId;
            object.set('trainerId', trainer);

            // Saves the event with the updated data
            object.save().then((response) => {
                console.log('Updated trainer on activity', response);
                async.resolve(new Activity(response));
            }).catch((error) => {
                console.error('Error while updating trainer on the event', error);
            });
        });
        return async.promise;

    }

    function getActivityById(id)
    { 
        let  async = $q.defer();
        const ActivityObj = Parse.Object.extend('Activity');
        const query = new Parse.Query(ActivityObj);
        query.include("trainerId");
        
        query.get(id).then((result) => {
          console.log('Activity found', result);
          async.resolve(new Activity(result));
        }, (error) => {
          console.error('Error while fetching activity', error);
        });
        return async.promise;
    }

    function getActivitiesForEventByDateRange(eventId, minDate, maxDate) {
        let activities = [];
        let async = $q.defer(); 
        const ActivityObj = Parse.Object.extend('Activity');
        const query = new Parse.Query(ActivityObj);

        const EventObj = new Parse.Object("Event");
        EventObj.id = eventId;
        query.equalTo("eventId", EventObj);


        
        query.greaterThanOrEqualTo("activityDate", minDate);
        if (arguments.length > 2) {
            query.lessThanOrEqualTo("activityDate", maxDate);
        }
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

    function updateActivityDayAndTime(id, day, startTime){
        let  async = $q.defer();
        const ActivityObj = Parse.Object.extend('Activity');
        const query = new Parse.Query(ActivityObj);

        // Finds the Activity by its ID
        query.get(id).then((object) => {
            // Updates the day of the activity - based on given day 
            var currentDay = object.get('activityDate').getDay();
            var delta = day-currentDay;
            var currentDayInMonth = object.get('activityDate').getDate();
            var newDate = new Date(object.get('activityDate').getTime());
            newDate.setDate(currentDayInMonth + delta);

            object.set('activityDate', newDate);
            object.set('activityTime', startTime);

            // Saves the event with the updated data
            object.save().then((response) => {
                console.log('Updated day on activity', response);
                async.resolve(new Activity(response));
            }).catch((error) => {
                console.error('Error while updating day on the activity', error);
            });
        });
        return async.promise;

    }

    return {
        createActivityforEvent: createActivityforEvent,
        createAllActivityforEvent: createAllActivityforEvent, 
        getActivitiesByDateRange: getActivitiesByDateRange,
        getActivitiesAndEventByTrainer: getActivitiesAndEventByTrainer, 
        getActivitiesAndEventForAll: getActivitiesAndEventForAll, 
        cancelActivity: cancelActivity, 
        updateActivityTrainer: updateActivityTrainer,
        getActivityById: getActivityById, 
        getActivitiesForEventByDateRange: getActivitiesForEventByDateRange,
        updateActivityDayAndTime: updateActivityDayAndTime
    }
});
