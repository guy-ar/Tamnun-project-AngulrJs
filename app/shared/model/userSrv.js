
scheduleApp.factory("userSrv", function($q, $http, $log) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let usersPerRole = {};
    let getUserFromDb = false;
    let nextUserId = 0;
    const ROLE_TRAINER = "trainer";
    const ROLE_ADMIN = "admin";
    const STATE_ACTIVE = "Active";
    const STATE_CANCEL = "Cancel"
    
    const SITE_PARDESIA = 1;
    const SITE_YOQNEAM = 2;


    function User(plainUserOrId, userId, fname, lname, email, phone, role, state, siteId, isSigned) {
        if (arguments.length > 1) {
            this.id = plainUserOrId;
            this.userId = userId;
            this.fname = fname;
            this.lname = lname;
            this.email = email;
            this.phone = phone;
            this.role = role;
            this.state = state;
            if (SITE_PARDESIA == siteId)
            {
                this.site = "Pardesia";
            } else if (SITE_YOQNEAM == siteId){
                this.site = "Yoqneam";
            }
            this.isSigned = isSigned;
        } else {
            this.id = plainUserOrId.id;
            this.userId = plainUserOrId.userId;
            this.fname = plainUserOrId.get("fname");
            this.lname = plainUserOrId.get("lname");
            this.email = plainUserOrId.get("email");
            this.phone = plainUserOrId.get("phone");
            this.role = plainUserOrId.get("role");
            this.state = plainUserOrId.get("state");
            if (SITE_PARDESIA == plainUserOrId.get("siteId"))
            {
                this.site = "Pardesia";
            } else if (SITE_YOQNEAM == plainUserOrId.get("siteId")){
                this.site = "Yoqneam";
            }
            this.isSigned = plainUserOrId.get("isSigned");
        }
    }

    

    function isLoggedIn() {
        return activeUser ? true : false;
    }

    // login will check if the user and password exists. If so it will update the active user 
    // variable and will return it
    function login(userIdOrEmail, pwd) {
        var async = $q.defer();

        activeUser = null;
        isAdmin = false;
        /*$http.get("app/shared/model/data/users.json").then(function(res) {
            var users = res.data;
            for (var i = 0; i < users.length && !activeUser; i++) {
                if (((userIdOrEmail === users[i].userId) || (userIdOrEmail === users[i].email)) && (pwd === users[i].pwd)) {
                    activeUser = new User(users[i]);
                    // check if user is admin
                    if (ROLE_ADMIN == users[i].role) {
                        isAdmin = true;
                    }
                    async.resolve(activeUser);
                } 
            }
            if (!activeUser) {
                async.reject(401);
            }
        }, function(err) {
            async.reject(err);
        })*/

        // to ask Nir how to check if this is user or email
        Parse.User.logIn(userIdOrEmail, pwd).then(function (user) {
            // Do stuff after successful login
            console.log('Logged in user', user);
            activeUser = new User(user);
            if (ROLE_ADMIN == activeUser.role) {
                isAdmin = true;
            }
            async.resolve(activeUser);
        }).catch(error => {
            console.error('Error while logging in user', error);
            async.reject(error);
        });



        return async.promise;
    }

    function logout() {
        activeUser = null;
        isAdmin = false;
    }

    function getActiveUser() {
        return activeUser;
    }

    function getAllUsersFromDb(){
        // THIS LOGIC IS NOT IN USE ANYMORE
        // it is for getting the data from the cahce - not relelvant 
        // this method will load the users from DB  - they will be kept on the service as cache
        var async = $q.defer();

        $http.get("app/shared/model/data/users.json").then(function(res) {
            var users = res.data;
            // go over the users and keep them in object per role
            for (var i = 0; i < users.length; i++) {
                let role = users[i].role;
                let site = users[i].siteId;

                if (!usersPerRole[role]) {
                    // add new array for the role
                    usersPerRole[role] = [];
                }
                // check the site - if no site, user will be added to All group
                if (!site) {
                    site = "All";
                    // push it to the object
                    users[i].siteId = "All";
                }
                let user = new User(users[i]);
                //Json file include user id - need to incremenet it
                nextUserId++;
                

                // push the user under the specific role 
                usersPerRole[role].push(user);
                // for Admin - need to retrieve also the work hours
                
            }
            getUserFromDb = true;
            $log.info("sucessful retreive of users from DB")
            async.resolve(usersPerRole);
        }, function(err) {
            async.reject(err);
        })
        
       

        return async.promise;
    }

    // retreive list of trainers
    function getTrainers() {
        var async = $q.defer();
        
        // Building a query
       let trainers = [];
       const UserObj = new Parse.User();
       const query = new Parse.Query(UserObj);
       query.equalTo("role", ROLE_TRAINER);

       // Executing the query
       query.find().then((results) => {
         console.log('Trainers found', results);
         for (let index = 0; index < results.length; index++) {
             trainers.push(new User(results[index]));
         }
         async.resolve(trainers);
       }, (error) => {
         console.error('Error while fetching Trainer', error);
         async.reject(error);
       });


        return async.promise;
    }  

    function isLoggedAdmion() {
        return isAdmin;
    }

    function addTrainer(fname, lname, phone, email, siteId, userId){
        // GUY NEED TO SWITCH TO HAVE IT AS NEW USER AND NOT ONLY NEW TRAINER
        var async = $q.defer();
        // for now just write to log - as we do not have DB
        $log.info("New Trainer call");

        // Preparing the new parse trainer object to save
        const user = new Parse.User()
        user.set('username', userId);
        user.set('email', email);
        user.set('fname', fname);
        user.set('lname', lname);
        user.set('phone', phone);
        user.set('isSigned', false);
        user.set('state', STATE_ACTIVE);
        user.set('role', ROLE_TRAINER);
        user.set('siteId', siteId);
        user.set('password', '#Password123');
        
        user.signUp().then((result) => {
            async.resolve(new User(result));
            console.log('User signed up', result);
        }).catch(error => {
            console.error('Error while signing up user', error);
        });

        /*let newTrainer = new User(nextUserId, userId, fname, lname, email, phone, ROLE_TRAINER, STATE_ACTIVE, siteId, 0);
        usersPerRole[ROLE_ADMIN].push(newTrainer);

        // // preparing the id for the next addition
        ++nextUserId;
        async.resolve(newTrainer);*/
        
        return async.promise;
    }

     

     

    function getUserById(id)
    { // NOT IN USE FOR NOW
        let  async = $q.defer();
        const User = new Parse.User();
        const query = new Parse.Query(User);
        
        query.get(id).then((user) => {
          console.log('User found', user);
          async.resolve(new User(user));
        }, (error) => {
          console.error('Error while fetching user', error);
        });
        return async.promise;
    }

    function updateTrainer(id, fname, lname, phone, email, siteId, userName){
        // this fucntion should go to DB and update trainer by his ID
        //since we have hack with db on cache - we first need to find the user in the "DB"
        // and then update it
        // as this is not real async call with DB, it is not full simulation 
        let  async = $q.defer();

       /* // get the user entry - by ID - only relevant for "DB on client mode"
        let users = usersPerRole[ROLE_TRAINER];
        for (let i = 0, len = users.length; i<len; i++){
            if (id == users[i].id)
            {
                //update all user details
                users[i].fname = fname;
                users[i].lname = lname;
                users[i].phone = phone;
                users[i].email = email;
                users[i].siteId = siteId;
                users[i].userId = userName;

                async.resolve(users[i])
            }
        }*/
        const UserObj = new Parse.User();
        const query = new Parse.Query(UserObj);
        // Finds the user by its ID
        query.get(id).then((user) => {
            // Updates the data we want
            user.set('username', userName);
            user.set('email', email);
            user.set('fname', fname);
            user.set('lname', lname);
            user.set('phone', phone);
            user.set('siteId', siteId);

            // Saves the user with the updated data
            user.save().then((response) => {
                console.log('Updated user', response);
                async.resolve(new User(response));
            }).catch((error) => {
                console.error('Error while updating user', error);
            });
        });

        return async.promise;

    }


    


  


    function cancelTrainer(id){
        // simualte  access to DB - therefore func is a-sync
        //since we have DB on client - need to find the trainer and update his status
        //Guy TODO - add verification that user have no linked events
        let  async = $q.defer();

        // get the user entry - by ID - only relevant for "DB on client mode"
        let users = usersPerRole[ROLE_TRAINER];
        for (let i = 0, len = users.length; i<len; i++){
            if (id == users[i].id)
            {
                //update all user details
                users[i].state = STATE_CANCEL;
                async.resolve(users[i])
            }
        }

        return async.promise;

    }

    
    return {
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        getActiveUser: getActiveUser,
        isLoggedAdmion: isLoggedAdmion,
        getTrainers: getTrainers, 
        addTrainer: addTrainer,
        getUserById: getUserById, 
        updateTrainer: updateTrainer,
        cancelTrainer: cancelTrainer
    }

});