scheduleApp.factory("eventSrv", function($q, $log, activitySrv) {
    
    const STATE_ACTIVE = "Active";
    const STATE_CANCEL = "Cancel";
    const STATE_TENTATIVE = "Tentative";

    function Event(plainEventOrId, name, day, type, startTime, duration, state, siteId, isRepeat, trainerId, activityNum, startDate) {
        if (arguments.length > 1) {
            this.id = plainEventOrId;
            this.name = name;
            this.day = day;
            this.type = type;
            this.startTime = startTime;
            this.duration = duration;
            this.state = state;
            this.siteId = siteId;
            this.isRepeat = isRepeat;
            this.trainerId = trainerId;
            this.activityNum = activityNum;
            this.startDate = startDate;
        } else {
            this.id = plainEventOrId.id;
            
            this.name = plainEventOrId.get("name");
            this.day = plainEventOrId.get("day");
            this.type = plainEventOrId.get("type");
            this.startTime = plainEventOrId.get("startTime");
            this.duration = plainEventOrId.get("duration");
            this.state = plainEventOrId.get("state");
            this.siteId = plainEventOrId.get("siteId");
            this.isRepeat = plainEventOrId.get("isRepeat");
            // if trainer was set
            if (plainEventOrId.get("trainerId") != null || 
                plainEventOrId.get("trainerId")!=undefined) {
                this.trainerId = plainEventOrId.get("trainerId").id;
                this.trainerDtls = {};
                this.trainerDtls.userName = plainEventOrId.get("trainerId").get("userName");
                this.trainerDtls.fname = plainEventOrId.get("trainerId").get("fname");
                this.trainerDtls.lname = plainEventOrId.get("trainerId").get("lname");
            }
            
            this.activityNum = plainEventOrId.get("activityNum");
            this.startDate = plainEventOrId.get("startDate");
        }
    }

     // retreive list of Events
    function getEvents() {
        var async = $q.defer();
        
        // Building a query
        let events = [];
        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);
        query.include("trainerId");


        // Executing the query
        query.find().then((results) => {
            console.log('Events found', results);
            for (let index = 0; index < results.length; index++) {
                events.push(new Event(results[index]));
            }
            async.resolve(events);
        }, (error) => {
            console.error('Error while fetching events', error);
            async.reject(error);
        });
            return async.promise;
    } 

    //function addEvent(name, day, type, startTime, duration, siteId, isRepeat, trainerId, activityNum, startDate){
        function addEvent(eventInputObj, isCreateAct){
        
        var async = $q.defer();
        // for now just write to log - as we do not have DB
        $log.info("New Event call");

        // Preparing the new parse event object to save
        const EventObj = Parse.Object.extend('Event');
        const myNewObject = new EventObj();

        myNewObject.set('name', eventInputObj.name);
        // need to ge the date from the date - it is less important for the event - but may be needed to the activity
        //myNewObject.set('day', eventInputObj.day);
        myNewObject.set('type', eventInputObj.type);
        myNewObject.set('startTime', eventInputObj.startTime);
        myNewObject.set('duration', eventInputObj.duration);
        myNewObject.set('siteId', eventInputObj.siteId);
        myNewObject.set('isRepeat', eventInputObj.isRepeat);
        myNewObject.set('state', STATE_TENTATIVE);
        if (eventInputObj.trainerId != undefined) {
            let trainer = new Parse.Object("Trainer");
            trainer.id =  eventInputObj.trainerId;
            myNewObject.set('trainerId', trainer);
        }
        myNewObject.set('activityNum', eventInputObj.activityNum);
        myNewObject.set('startDate', eventInputObj.startDate); 
        if (eventInputObj.day == null || eventInputObj.day == undefined || eventInputObj.day == ""){
            myNewObject.set('day', eventInputObj.startDate.getDay().toString()); 
        } else {
            myNewObject.set('day', eventInputObj.day); 
        }

        myNewObject.save().then(
            (result) => {;
                let event = new Event(result);
                $log.info('Event was added', result);
                async.resolve(event);
                if (isCreateAct) {
                    // call to activitySrv in order to create the instances per event
                    activitySrv.createAllActivityforEvent(event).then(function (actResult){

                    
                        // meanwhile create the activities for the event - assume no error will be done
                        $log.info('activity was added', JSON.stringify(actResult));
                    }, 
                    function (error) {
                    console.error('Error while creating activity: ', error);
                    async.reject(error);
                    });
                }
            }).catch(error => {
                console.error('Error creating Event', error);
            });
        
        return async.promise;
    }

    function updateEventTrainer(id, trainerId){
        
        let  async = $q.defer();
        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);

        // Finds the Event by its ID
        query.get(id).then((object) => {
            // Updates the trainer ID
            let trainer = new Parse.Object("Trainer");
            trainer.id =  trainerId;
            object.set('trainerId', trainer);

            // Saves the event with the updated data
            object.save().then((response) => {
                console.log('Updated trainer on event', response);
                async.resolve(new Event(response));
            }).catch((error) => {
                console.error('Error while updating trainer on the event', error);
            });
        });
        return async.promise;
    }

    function updateEventDtls(event){
        
        let  async = $q.defer();
        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);

        // Finds the Event by its ID
        query.get(event.id).then((object) => {
            // Updates the event dtls
            object.set('name', event.name);
            object.set('day', event.day);
            object.set('type', event.type);
            object.set('startTime', event.startTime);
            object.set('duration', event.duration);
            object.set('siteId', event.siteId);
            object.set('isRepeat', event.isRepeat);
            object.set('activityNum', event.activityNum);
            object.set('startDate', event.startDate);
            // Saves the event with the updated data
            object.save().then((response) => {
                console.log('Updated event details', response);
                async.resolve(new Event(response));
            }).catch((error) => {
                console.error('Error while updating event details', error);
            });
        });
        return async.promise;
    }

    function updateEventState(id, state){
        let  async = $q.defer();

        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);

        // Finds the user by its ID
        query.get(id).then((object) => {
            // Updates the data we want
            object.set('state', state);
            

            // Saves the user with the updated data
            object.save().then((response) => {
                console.log('update event state', response);
                async.resolve(new Event(response));
            }).catch((error) => {
                console.error('Error while update the event state', error);
            });
        });

        return async.promise;

    }

    
    function getEventById(id)
    { 
        let  async = $q.defer();
        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);
        query.include("trainerId");
        
        query.get(id).then((result) => {
          console.log('Event found', result);
          async.resolve(new Event(result));
        }, (error) => {
          console.error('Error while fetching event', error);
        });
        return async.promise;
    }

    return {
        getEvents: getEvents,
        addEvent: addEvent,
        updateEventTrainer: updateEventTrainer,
        updateEventState: updateEventState,
        updateEventDtls: updateEventDtls,
        getEventById: getEventById
        
    }

});