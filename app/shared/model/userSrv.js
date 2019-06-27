
scheduleApp.factory("userSrv", function($q, $http) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let usersPerRole = {};
    let getUserFromDb = false;
    const ROLE_TRAINER = "trainer";
    const ROLE_ADMIN = "admin";

    function User(plainUser) {
        this.id = plainUser.id;
        this.userId = plainUser.userId;
        this.fname = plainUser.fname;
        this.lname = plainUser.lname;
        this.email = plainUser.email;
        this.phone = plainUser.phone;
        this.role = plainUser.role;
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
                
                // push the user under the specific role 
                usersPerRole[role].push(new User(users[i]));
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

        if (!getUserFromDb) {
            getAllUsersFromDb.then(function(res) {
                return usersPerRole[ROLE_RAINER];
            });
        } else {
            return usersPerRole[ROLE_TRAINER];
        }
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