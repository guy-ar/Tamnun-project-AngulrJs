scheduleApp.factory("workHourSrv", function($q, $http, $log) {

    var nextWorkHour = 100;
    var getWorkFromDb = false;
    // hold userId: workHours[]

    function WorkHours(plainWorkHoursOrId, day, startHour, endHour, trainerId) {
        if (arguments.length > 1) {
            this.id = plainWorkHoursOrId;
            this.day = day;
            this.startHour = startHour;
            this.endHour = endHour;
            this.trainerId = trainerId;
        } else {
            this.id = plainWorkHoursOrId.id;
            this.day = plainWorkHoursOrId.get("day");
            this.startHour = plainWorkHoursOrId.get("startHour");
            this.endHour = plainWorkHoursOrId.get("endHour");
            this.trainerId = plainWorkHoursOrId.get("trainerId").id;
        }
    }
// test
    
    function getTrainersWH(){
        // this method will load the users from DB  - they will be kept on the service as cache
        var async = $q.defer();
        let workHours = [];
     
        const workHoursObj = Parse.Object.extend('workHours');
        const query = new Parse.Query(workHoursObj);
        var workHoursPerUser = {};
        
    
        query.find().then((results) => {
            // You can use the "get" method to get the value of an attribute
            // Ex: response.get("<ATTRIBUTE_NAME>")
            console.log('workHours found', results);
            for (let index = 0; index < results.length; index++) {
                let userId = results[index].get("trainerId").id;
                if (!workHoursPerUser[userId]) {
                    // first create entry for the user
                    workHoursPerUser[userId] = [];
                }
                workHours = new WorkHours(results[index]);
                $log.info("found work hours for user: " + JSON.stringify(workHours));
                workHoursPerUser[userId].push(workHours); 
            }
            async.resolve(workHoursPerUser);
        }, (error) => {

            console.error('Error while fetching workHours', error);
        });
        return async.promise;
    }
    function addWorkHours(trainerId, day, startHour, endHour)
    {
        // SIMULATE A-SYNC PROCESS - the cache is help on the userSrv - so need to call temp fucntion to store it 
        var async = $q.defer();
        $log.info("New work hour call");
        const workHoursObj = Parse.Object.extend('workHours');
        const myNewObject = new workHoursObj();

        myNewObject.set('day', day);
        myNewObject.set('startHour', startHour);
        myNewObject.set('endHour', endHour);
        let trainer = new Parse.Object("Trainer");
        //trainer.objectId = trainerId;
        trainer.id =  trainerId;
        
        myNewObject.set('trainerId', trainer);
        myNewObject.save().then(
            (result) => {
                console.log('workHours created', result);
                async.resolve(new WorkHours(result));
            },
            (error) => {
                console.error('Error while creating workHours: ', error);
            }
        );

        return async.promise;
    }

    


    
    function editWorkHours(trainerId, id, day, startHour, endHour)
    {
        // SIMULATE A-SYNC PROCESS - the cache is help on the userSrv - so need to call temp fucntion to store it 
        var async = $q.defer();
        $log.info("update work hour call");

        const workHoursObj = Parse.Object.extend('workHours');
        const query = new Parse.Query(workHoursObj);
        
        query.get(id).then((object) => {
            object.set('day', day);
            object.set('startHour', startHour);
            object.set('endHour', endHour);

            object.save().then((response) => {
                console.log('Updated workHours', response);
                async.resolve(new WorkHours(response))
            }, (error) => {
                console.error('Error while updating workHours', error);
            });
        });

        return async.promise;
    }


    return {
        addWorkHours: addWorkHours,
        getTrainersWH: getTrainersWH, 
        editWorkHours: editWorkHours
    }

});