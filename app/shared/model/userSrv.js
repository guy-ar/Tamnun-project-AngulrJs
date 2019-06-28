
scheduleApp.factory("userSrv", function($q, $http, $log) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let usersPerRole = {};
    let getUserFromDb = false;
    const ROLE_TRAINER = "trainer";
    const ROLE_ADMIN = "admin";
    const STATE_NEW = 0;
    const STATE_REGISTERED = 1;
    const STATE_CANCELLED = 2;
    const SITE_PARDESIA = 1;
    const SITE_YOQNEAM = 2;

    function User(plainUser) {
        this.id = plainUser.id;
        this.userId = plainUser.userId;
        this.fname = plainUser.fname;
        this.lname = plainUser.lname;
        this.email = plainUser.email;
        this.phone = plainUser.phone;
        this.role = plainUser.role;
        this.workHours = plainUser.workHours;
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
    return {
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        getActiveUser: getActiveUser,
        isLoggedAdmion: isLoggedAdmion,
        getTrainers: getTrainers
    }

});