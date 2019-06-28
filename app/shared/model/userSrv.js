
scheduleApp.factory("userSrv", function($q, $http, $log) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let usersPerRole = {};
    let getUserFromDb = false;
    let nextUserId = 0;
    const ROLE_TRAINER = "trainer";
    const ROLE_ADMIN = "admin";
    const STATE_ACTIVE = "Active";
    
    const SITE_PARDESIA = 1;
    const SITE_YOQNEAM = 2;

    function User(plainUserOrId, userId, fname, lname, email, phone, role, state, siteId, isSigned, workHours) {
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
            this.workHours = workHours;
        } else {
            this.id = plainUserOrId.id;
            this.userId = plainUserOrId.userId;
            this.fname = plainUserOrId.fname;
            this.lname = plainUserOrId.lname;
            this.email = plainUserOrId.email;
            this.phone = plainUserOrId.phone;
            this.role = plainUserOrId.role;
            this.state = plainUserOrId.state;
            if (SITE_PARDESIA == plainUserOrId.siteId)
            {
                this.site = "Pardesia";
            } else if (SITE_YOQNEAM == plainUserOrId.siteId){
                this.site = "Yoqneam";
            }
            this.isSigned = plainUserOrId.isSigned;
            this.workHours = plainUserOrId.workHours;
        }
    }

    function WorkHours(plainWorkHours) {
        this.id = plainWorkHours.id;
        this.userId = plainWorkHours.userId;
        this.day = plainWorkHours.day;
        this.startHour = plainWorkHours.startHour;
        this.endHour = plainWorkHours.endHour;
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
        $http.get("app/shared/model/data/users.json").then(function(res) {
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
        })

        // if (email === "nir@nir.com" && pwd === "123") {
        //     activeUser = new User({ id: 1, fname:"Nir", lname: "Channes", email: "nir@nir.com" });
        //     async.resolve(activeUser);
        // } else {
        //     async.reject(401);
        // }

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
                if (role == ROLE_TRAINER) {
                    user.workHours = [];
                    // get the work hours
                    getWorkHoursForUserFromDb(users[i].id).then
                    (function(workHours) {
                        user.workHours = workHours;
                      }, function(err) {
                        $log.error(err);
                      })
                }

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
        if (!getUserFromDb) {
            getAllUsersFromDb().then(function(res) {
                async.resolve(usersPerRole[ROLE_TRAINER]);
            });
        } else {
            return usersPerRole[ROLE_TRAINER];
        }
        // in case no call was made before to get the trainers
        return async.promise;
    }

    function getWorkHoursForUserFromDb(userId){
        // this method will load the users from DB  - they will be kept on the service as cache
        var async = $q.defer();
        let workHours = [];
        let userWorkHours = [];
        $http.get("app/shared/model/data/workHours.json").then(function(res) {
            workHours = res.data;
            // go over the users and keep them in object per role
            for (var i = 0; i < workHours.length; i++) {   
                if (userId == workHours[i].userId) {
                    // send back the work hours
                    $log.info("found work hours for user: " + userId);
                    userWorkHours.push(workHours[i]); 
                }
            }
            
            // need to return empty array
            async.resolve(userWorkHours);
        }, function(err) {
            async.reject(err);
        })
        return async.promise;
    }


    function isLoggedAdmion() {
        return isAdmin;
    }

    function addTrainer(fname, lname, phone, email, siteId, userId){
        var async = $q.defer();
        // for now just write to log - as we do not have DB
        $log.info("New Trainer call");
        let newTrainer = new User(nextUserId, userId, fname, lname, email, phone, ROLE_TRAINER, STATE_ACTIVE, siteId, 0, []);
        usersPerRole[ROLE_ADMIN].push(newTrainer);

        // // preparing the id for the next addition
        ++nextUserId;
        async.resolve(newTrainer);
        return async.promise;
    }

    function getUserById(id)
    {
        let  async = $q.defer();
        // instead go to DB in async mode = get the data from client cache
        // as we have a hack and not waorking with server

        // go over usersPerRole and get the user detilas by Id
        let roles = Object.keys(usersPerRole);
        for (let role in roles) {
            let users =  roles[role];
            for (let i = 0, len = users.length; i<len; i++){
                if (id == users[i])
                {
                    async.resolve(users[i])
                }
            }
        }

        // no user found
        async.resolve({});
        return async.promise;
    }

    function updateTrainer(id, fname, lname, phone, email, siteId, userId){
        // this fucntion should go to DB and update trainer by his ID
        //since we have hack with db on cache - we first need to find the user in the "DB"
        // and then update it
        // as this is not real async call with DB, it is not full simulation 
        let  async = $q.defer();

        // get the user entry - by ID - only relevant for "DB on client mode"
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
                users[i].userId = userId;

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
        updateTrainer: updateTrainer
    }

});