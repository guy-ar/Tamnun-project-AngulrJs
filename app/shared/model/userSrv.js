
scheduleApp.factory("userSrv", function($q, $http, $log) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let isTrainer = false;
    let usersPerRole = {};
   
    const ROLE_TRAINER = "trainer";
    const ROLE_ADMIN = "admin";
    
    
    const SITE_PARDESIA = 1;
    const SITE_YOQNEAM = 2;


    function User(plainUserOrId, userName, email, role, siteId) {
        if (arguments.length > 1) {
            this.id = plainUserOrId;
            this.userName = userName;
            this.email = email;
            this.role = role;
            // support 3 values -1 for all, 1 for pardesiya, 2 for yoqneam
            this.siteId = siteId;
        } else {
            this.id = plainUserOrId.id;
            this.userName = plainUserOrId.get("username");
           // need to check if to take the email from e_mail or from origianl email field
            this.email = plainUserOrId.get("e_mail");
            this.role = plainUserOrId.get("role");
            this.siteId = plainUserOrId.get("siteId");
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

    function signup(userName, email, role, siteId, password) {
        var async = $q.defer();
        // for now just write to log - as we do not have DB
        $log.info("sign-up call");

        const user = new Parse.User()
        user.set('username', userName);
        user.set('email', email);
        user.set('role', role);
        user.set('siteId', siteId);
        user.set('e_mail', email);
        //user.set('password', '#Password123');
        user.set('password', password);
        // GUY TODO
        // need to add logic - if username already exist - throw an error
        //if sign up as trainer - user must exist in trainer table
        // if signup as admin - ??? for now not handled - may need also Admin table
        // future release - support for manager role
        
        user.signUp().then((user) => {
            console.log('User signed up', user);
            async.resolve(new Trainer(user));
        }).catch(error => {
       
            console.error('Error while signing up user', error);
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
        isLoggedTrainer: isLoggedTrainer, 
        signup: signup

    }

});