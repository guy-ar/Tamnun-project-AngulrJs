
scheduleApp.factory("userSrv", function($q, $http, $log) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let isTrainer = false;
    let usersPerRole = {};
    let getUserFromDb = false;
    let nextUserId = 0;
    const ROLE_TRAINER = "trainer";
    const ROLE_ADMIN = "admin";
    
    
    const SITE_PARDESIA = 1;
    const SITE_YOQNEAM = 2;


    function User(plainUserOrId, userName, fname, lname, email, phone, role, state, siteId, isSigned) {
        if (arguments.length > 1) {
            this.id = plainUserOrId;
            this.userName = userName;
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
            this.userName = plainUserOrId.get("username");
            this.fname = plainUserOrId.get("fname");
            this.lname = plainUserOrId.get("lname");
            this.email = plainUserOrId.get("e_mail");
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
        

        // to ask Nir how to check if this is user or email
        Parse.User.logIn(userIdOrEmail, pwd).then(function (user) {
            // Do stuff after successful login
            console.log('Logged in user', user);
            activeUser = new User(user);
            if (ROLE_ADMIN == activeUser.role) {
                isAdmin = true;
            } else if (ROLE_TRAINER == activeUser.role) {
                isTrainer = true;
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
        isTrainer = false;
    }

    function getActiveUser() {
        return activeUser;
    }


    function isLoggedAdmion() {
        return isAdmin;
    }

    function isLoggedTrainer() {
        return isTrainer;
    }

    function getUserById(id)
    { // NOT IN USE FOR NOW
        let  async = $q.defer();
        const UserObj = new Parse.User();
        const query = new Parse.Query(UserObj);
        
        query.get(id).then((result) => {
          console.log('User found', result);
          async.resolve(new User(result));
        }, (error) => {
          console.error('Error while fetching user', error);
        });
        return async.promise;
    }

    

    
    return {
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        getActiveUser: getActiveUser,
        isLoggedAdmion: isLoggedAdmion,
        getUserById: getUserById, 
        isLoggedTrainer: isLoggedTrainer

    }

});