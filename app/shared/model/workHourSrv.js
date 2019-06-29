scheduleApp.factory("workHourSrv", function($q, $http, $log) {

    var nextWorkHour = 100;
    var getWorkFromDb = false;
    workHoursPerUser = {}; // hold userId: workHours[]

    function WorkHours(plainWorkHoursOrId, day, startHour, endHour) {
        if (arguments.length > 1) {
            this.id = plainWorkHoursOrId;
            this.day = day;
            this.startHour = startHour;
            this.endHour = endHour;
        } else {
            this.id = plainWorkHoursOrId.id;
            this.day = plainWorkHoursOrId.day;
            this.startHour = plainWorkHoursOrId.startHour;
            this.endHour = plainWorkHoursOrId.endHour;
        }
    }

    function getWorkHoursForUserFromDb(userId){
        // simulate method load the specific user work hours from DB  
        // temporary- they will be kept on the service as cache
        var async = $q.defer();
        
        let userWorkHours = [];
        userWorkHours = workHoursPerUser[userId];
        // need to return empty array
        async.resolve(userWorkHours);
       
        return async.promise;
    }

    function getWorkHoursFromDb(){
        // this method will load the users from DB  - they will be kept on the service as cache
        var async = $q.defer();
        let workHours = [];
        
        $http.get("app/shared/model/data/workHours.json").then(function(res) {
            let workHoursRow = res.data;
            // go over the users and keep them in object per role
            for (var i = 0; i < workHoursRow.length; i++) {
                let userId = workHoursRow[i].userId;
                if (!workHoursPerUser[userId]) {
                    // first create entry for the user
                    workHoursPerUser[userId] = [];
                }
                workHours = new WorkHours(workHoursRow[i]);
                
                $log.info("found work hours for user: " + JSON.stringify(workHours));
                workHoursPerUser[userId].push(workHours); 
                
            }
            // WH need to ve retrieved from DB only once - due to hack of DB on client
            getWorkFromDb = true;
            // need to return the "DB" object
            async.resolve(workHoursPerUser);
        }, function(err) {
            async.reject(err);
        })
        return async.promise;
    }
    function addWorkHours(trainerId, day, startHour, endHour)
    {
        // SIMULATE A-SYNC PROCESS - the cache is help on the userSrv - so need to call temp fucntion to store it 
        var async = $q.defer();
        $log.info("New work hour call");
        let newWorkHours = new WorkHours(nextWorkHour, day, startHour, endHour);
        // instead sending it to DB - locate the user and add the work hours on him
        if (!workHoursPerUser[trainerId]){
            workHoursPerUser[trainerId] = [];
        }
        workHoursPerUser[trainerId].push(newWorkHours);
        nextWorkHour++;
        async.resolve(newWorkHours)

        return async.promise;
    }

    function getTrainersWH() {
        var async = $q.defer();
        if (!getWorkFromDb) {
            getWorkHoursFromDb().then(function(res) {
                async.resolve(workHoursPerUser);
            });
        } else {
            async.resolve(workHoursPerUser);
        }
        // in case no call was made before to get the trainers
        return async.promise;
    }

    
    function editWorkHours(trainerId, id, day, startHour, endHour)
    {
        // SIMULATE A-SYNC PROCESS - the cache is help on the userSrv - so need to call temp fucntion to store it 
        var async = $q.defer();
        $log.info("update work hour call");
        
        // instead sending it to DB - locate the user and update all the attributes
        let userWorkHours = workHoursPerUser[trainerId];
        for (let i = 0, len = userWorkHours.length; i<len; i++){
            if (id == userWorkHours[i].id)
            {
                //update all user details
                userWorkHours[i].day = day;
                userWorkHours[i].startHour = startHour;
                userWorkHours[i].endHour = endHour;
                
                async.resolve(userWorkHours[i])
            }
        }

        return async.promise;
    }


    return {
        getWorkHoursForUserFromDb: getWorkHoursForUserFromDb,
        getWorkHoursFromDb: getWorkHoursFromDb,
        addWorkHours: addWorkHours,
        getTrainersWH: getTrainersWH, 
        editWorkHours: editWorkHours
    }

});