
scheduleApp.factory("userSrv", function($q, $log, trainerSrv) {

    var activeUser = null; // new User({id: 1, fname: "Nir" ...})
    let isAdmin = false;
    let isTrainer = false;
    let usersPerRole = {};
    var signupTrainer = null;
   
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
        isTrainer = false;
        

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

    function signupAndValidate(userName, email, role, siteId, password) {
        
        signupTrainer = null;

        // for now just write to log - as we do not have DB
        $log.info("signupAndValidate call");
                
       
        // need to add logic - if username already exist  and if the email is in use is verified by Parse
        //if sign up as trainer - user must exist in trainer table
        // if signup as admin - ??? for now not handled - may need also Admin table
        // future release - support for manager role
        if (role == ROLE_TRAINER) {
            var asyncTrianer = $q.defer();

            trainerSrv.getTrainersByUserName(userName).then(function (result){
            // check if trainer was found by this name
                if (result.length == 1) {
                    // can continue
                    $log.info("trainer was found with userName - can continue with create user");
                    signupTrainer = result[0];

                   
                    signup(userName, email, role, siteId, password, result[0].id).then(function(user){
                        // after sign up - need to update the trainer with the user ID and registered indication
                        //call to update trainer...
                        // return the user
                        async.resolve(user);


                    }, function(err){
                        console.error('Error while calling to sign up user', err);
                        async.reject(err);

                    });
                    return async.promise;
                    

                } else {
                    // no trainers or more then one
                    let error = {};
                    error.code = "C100";
                    error.message = "No trainer exist with given user name";
                    asyncTrianer.reject(error);
                }

               

                

            }, function(err){
                $log.error('Error while signing up user and validate trainer', err);
                asyncTrianer.reject(error);
            });
            return asyncTrianer.promise;
        
        } else {
            // Role is not trainer - just need to sign up
            var async = $q.defer();
            signup(userName, email, role, siteId, password).then(function(user){
                $log.info("sucessful signup of user - Admin or manager");
                // return the user
                async.resolve(user);
            }, function(err){
                console.error('Error while calling to sign up user', err);
                async.reject(err);
            });
            return async.promise;

        }
    }

    function signup(userName, email, role, siteId, password){

        $log.info("sign-up call");
        activeUser = null;
        isAdmin = false;
        isTrainer = false;

        const userObj = new Parse.User()
        userObj.set('username', userName);
        userObj.set('email', email);
        userObj.set('role', role);
        userObj.set('siteId', siteId);
        userObj.set('e_mail', email);
        //user.set('password', '#Password123');
        userObj.set('password', password);
        
        var async = $q.defer();
        userObj.signUp().then((user) => {
            console.log('User signed up', user);
            activeUser = new User(user);
            if (ROLE_ADMIN == activeUser.role) {
                isAdmin = true;
            } else if (ROLE_TRAINER == activeUser.role) {
                isTrainer = true;
            }
            async.resolve(activeUser);
        }).catch(error => {
    
            console.error('Error while signing up user', error);
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
        isLoggedTrainer: isLoggedTrainer, 
        signup: signup,
        signupAndValidate: signupAndValidate

    }

});