scheduleApp.factory("trainerSrv", function($q, $log) {
    
    const STATE_ACTIVE = "Active";
    const STATE_CANCEL = "Cancel";

    function Trainer(plainTrainOrId, userName, fname, lname, email, phone, state, siteId, isSigned) {
        if (arguments.length > 1) {
            this.id = plainTrainOrId;
            this.userName = userName;
            this.fname = fname;
            this.lname = lname;
            this.email = email;
            this.phone = phone;
            this.role = role;
            this.state = state;
            this.siteId = siteId;
            this.isSigned = isSigned;
        } else {
            this.id = plainTrainOrId.id;
            this.userName = plainTrainOrId.get("userName");
            this.fname = plainTrainOrId.get("fname");
            this.lname = plainTrainOrId.get("lname");
            this.email = plainTrainOrId.get("e_mail");
            this.phone = plainTrainOrId.get("phone");
            this.state = plainTrainOrId.get("state");
            this.siteId = plainTrainOrId.get("siteId");
            this.isSigned = plainTrainOrId.get("isSigned");
        }
    }
    
    
    
    // retreive list of trainers
    function getTrainers() {
        var async = $q.defer();
        
        // Building a query
        let trainers = [];
        const TrainerObj = Parse.Object.extend('Trainer');
        const query = new Parse.Query(TrainerObj);


        // Executing the query
        query.find().then((results) => {
            console.log('Trainers found', results);
            for (let index = 0; index < results.length; index++) {
                trainers.push(new Trainer(results[index]));
            }
            async.resolve(trainers);
        }, (error) => {
            console.error('Error while fetching Trainer', error);
            async.reject(error);
        });
            return async.promise;
        } 


    function addTrainer(fname, lname, phone, email, siteId, userName){
        
        var async = $q.defer();
        // for now just write to log - as we do not have DB
        $log.info("New Trainer call");

        // Preparing the new parse trainer object to save
        const TrainerObj = Parse.Object.extend('Trainer');
        const myNewObject = new TrainerObj();

        myNewObject.set('fname', fname);
        myNewObject.set('lname', lname);
        myNewObject.set('siteId', siteId);
        myNewObject.set('isSigned', false);
        myNewObject.set('phone', phone);
        myNewObject.set('e_mail', email);
        myNewObject.set('userName', userName);
        myNewObject.set('state', STATE_ACTIVE);

        myNewObject.save().then(
            (result) => {
                async.resolve(new Trainer(result));
                console.log('Trainer was added', result);
            }).catch(error => {
                console.error('Error while signing up user', error);
            });
        
        return async.promise;
    }

    function updateTrainer(id, fname, lname, phone, email, siteId, userName){
        
        let  async = $q.defer();
        const TrainerObj = Parse.Object.extend('Trainer');
        const query = new Parse.Query(TrainerObj);

        // Finds the user by its ID
        query.get(id).then((object) => {
            // Updates the data we want
            object.set('userName', userName);
            object.set('e_mail', email);
            object.set('fname', fname);
            object.set('lname', lname);
            object.set('phone', phone);
            object.set('siteId', siteId);

            // Saves the trainer with the updated data
            object.save().then((response) => {
                console.log('Updated trainer', response);
                async.resolve(new Trainer(response));
            }).catch((error) => {
                console.error('Error while updating trainer', error);
            });
        });

        return async.promise;
    }



    function cancelTrainer(id){
        let  async = $q.defer();

        const TrainerObj = Parse.Object.extend('Trainer');
        const query = new Parse.Query(TrainerObj);

        // Finds the user by its ID
        query.get(id).then((object) => {
            // Updates the data we want
            object.set('state', STATE_CANCEL);
            

            // Saves the user with the updated data
            object.save().then((response) => {
                console.log('cancel trainer', response);
                async.resolve(new Trainer(response));
            }).catch((error) => {
                console.error('Error while cancelling user', error);
            });
        });

        return async.promise;

    }

    return {
        getTrainers: getTrainers,
        addTrainer: addTrainer,
        updateTrainer: updateTrainer,
        cancelTrainer: cancelTrainer
        
    }

});