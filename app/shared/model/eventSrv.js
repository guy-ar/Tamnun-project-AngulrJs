scheduleApp.factory("eventSrv", function($q, $log) {
    
    const STATE_ACTIVE = "Active";
    const STATE_CANCEL = "Cancel";
    const STATE_TENTATIVE = "Tentative";

    function Event(plainTrainOrId, name, day, type, startTime, duration, state, siteId, isRepeat, trainerId, activityNum, startDate) {
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
            this.id = plainTrainOrId.id;
            
            this.name = plainTrainOrId.get("name");
            this.day = plainTrainOrId.get("day");
            this.type = plainTrainOrId.get("type");
            this.startTime = plainTrainOrId.get("startTime");
            this.duration = plainTrainOrId.get("duration");
            this.state = plainTrainOrId.get("state");
            this.siteId = plainTrainOrId.get("siteId");
            this.isRepeat = plainTrainOrId.get("isRepeat");
            this.trainerId = plainTrainOrId.get("trainerId");
            this.activityNum = plainTrainOrId.get("activityNum");
            this.startDate = plainTrainOrId.get("startDate");
        }
    }

     // retreive list of Events
    function getEvents() {
        var async = $q.defer();
        
        // Building a query
        let events = [];
        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);


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

    function addEvent(name, day, type, startTime, duration, siteId, isRepeat, trainerId, activityNum, startDate){
        
        var async = $q.defer();
        // for now just write to log - as we do not have DB
        $log.info("New Event call");

        // Preparing the new parse event object to save
        const EventObj = Parse.Object.extend('Event');
        const myNewObject = new EventObj();

        myNewObject.set('name', name);
        myNewObject.set('day', day);
        myNewObject.set('type', type);
        myNewObject.set('startTime', startTime);
        myNewObject.set('duration', duration);
        myNewObject.set('siteId', siteId);
        myNewObject.set('isRepeat', isRepeat);
        myNewObject.set('state', STATE_TENTATIVE);
        if (trainerId != undefined) {
            let trainer = new Parse.Object("Trainer");
            trainer.id =  trainerId;
            myNewObject.set('trainerId', trainer);
        }
        myNewObject.set('activityNum', activityNum);
        myNewObject.set('startDate', startDate); 

        myNewObject.save().then(
            (result) => {
                async.resolve(new Event(result));
                console.log('Event was added', result);
            }).catch(error => {
                console.error('Error while signing up user', error);
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
            myNewObject.set('trainerId', trainer);

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

    function updateEventDtls(id, name, day, type, startTime, duration, siteId, isRepeat, activityNum, startDate){
        
        let  async = $q.defer();
        const EventObj = Parse.Object.extend('Event');
        const query = new Parse.Query(EventObj);

        // Finds the Event by its ID
        query.get(id).then((object) => {
            // Updates the event dtls
            myNewObject.set('name', name);
            myNewObject.set('day', day);
            myNewObject.set('type', type);
            myNewObject.set('startTime', startTime);
            myNewObject.set('duration', duration);
            myNewObject.set('siteId', siteId);
            myNewObject.set('isRepeat', isRepeat);
            myNewObject.set('activityNum', activityNum);
            myNewObject.set('startDate', startDate);
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