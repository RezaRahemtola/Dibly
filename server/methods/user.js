// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { UsersInformations } from '../../imports/databases/usersInformations.js';
import { Rules } from '../rules.js';


Meteor.methods({
    'checkIfUsernameIsTaken'({username}){
        // Type check to prevent malicious calls
        check(username, String);

        // Check if the given string is registered as someone's username in the database and return a boolean
        return (Meteor.users.findOne({username: username})) ? true : false;
    },
    'checkIfEmailIsTaken'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        // Check if the given string is registered as someone's email in the database and return a boolean
        return (Accounts.findUserByEmail(email)) ? true : false;
    },
    'createNewUser'({username, email}){
        // Type check to prevent malicious calls
        check(username, String);
        check(email, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in
            if(UsersInformations.find().count() >= 1){
                // There's at least one user (administrator), so this new user was created by him and already has some informations in the database

                // Updating informations with userId & username
                UsersInformations.update({email: email}, { $set: {
                    userId: Meteor.userId(),
                    username: username
                }});
            } else{
                // This is the first user of the blog (administrator), so we need to create the whole document to insert
                UsersInformations.insert({
                    userId: Meteor.userId(),
                    username: username,
                    email: email,
                    role: 'admin',
                    accessAllowed: true
                });
            }

            return true;
        }
    },
    'sendVerificationEmail'(){
        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if his email is verified
            const hasVerifiedEmail = Meteor.user().emails[0].verified;
            if(!hasVerifiedEmail){
                // Email isn't verified, sending the verification email
                Accounts.sendVerificationEmail(Meteor.userId());
            } else{
                // Email is verified, throwing an error
                throw new Meteor.Error('emailAlreadyVerified', 'Votre adresse email est déjà validée.');
            }
        }
    },
    'changeUsername'({newUsername}){
        // Type check to prevent malicious calls
        check(newUsername, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if the selected username isn't already taken
            const isTaken = (Meteor.users.findOne({username: newUsername})) ? true : false;
            if(!isTaken){
                // We can change his username
                Accounts.setUsername(Meteor.userId(), newUsername);
                // Updating the value in our database
                UsersInformations.update({userId: Meteor.userId()}, { $set: { username: newUsername } } );
            } else if(newUsername !== Meteor.user().username){
                // Username is already used by someone else than the current user, throwing an error
                throw new Meteor.Error('usernameTaken', "Ce nom d'utilisateur n'est pas disponible, veuillez en sélectionner un autre.");
            }
        }
    },
    'checkIfAccessAllowed'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        if(UsersInformations.find().count() === 0){
            // The database is empty so this is the first user, access is allowed
            return true;
        } else{
            // The database isn't empty so this email should have been added to the database by an administrator, retrieving informations with the given email
            const user = UsersInformations.findOne({email: email});

            if(user === undefined){
                // This email isn't in our database
                return false;
            } else{
                // This email is in our databse, we return the value of accessAllowed property (a boolean)
                return user.accessAllowed;
            }
        }
    },
    'getCurrentUserRole'(){
        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, find and return his role
            return UsersInformations.findOne({userId: Meteor.userId()}).role;
        }
    },
    'getRoles'(){
        // Return all availables roles
        return Rules.user.roles;
    },
    'getUserRole'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        // TODO: check if informations really exists
        // Find and return role of the corresponding user
        return UsersInformations.findOne({email: email}).role;
    },
    'getUsersForManagement'(){
        // TODO: move to a file for admin methods


        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to access users management (administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole !== 'admin'){
                // User isn't allowed to access users management, throwing an error
                throw new Meteor.Error('adminAccessDenied', 'Vous devez être administrateur pour effectuer cette action.');
            } else{
                // User is an administrator, initializing an array to return informations in a proper format
                var usersInformations = [];

                // Catching the list of all users & adding it's useful data to the array
                UsersInformations.find().forEach(function(doc){
                    usersInformations.push({
                        userId: doc.userId,
                        username: doc.username,
                        email: doc.email,
                        role: doc.role,
                        accessAllowed: doc.accessAllowed
                    });
                });

                return usersInformations;
            }
        }
    },
    'allowAccess'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to change user access (administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole !== 'admin'){
                // User isn't allowed to change user access, throwing an error
                throw new Meteor.Error('adminAccessDenied', 'Vous devez être administrateur pour effectuer cette action.');
            } else{
                // User is an administrator, updating the database
                // TODO: check if informations really exists

                UsersInformations.update({email: email}, { $set: {
                    accessAllowed: true
                }});
            }
        }
    },
    'removeAccess'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to change user access (administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole !== 'admin'){
                // User isn't allowed to change user access, throwing an error
                throw new Meteor.Error('adminAccessDenied', 'Vous devez être administrateur pour effectuer cette action.');
            } else{
                // User is an administrator, updating the database
                // TODO: check if informations really exists

                UsersInformations.update({email: email}, { $set: {
                    accessAllowed: false
                }});
            }
        }
    },
    'changeRole'({email, newRole}){
        // Type check to prevent malicious calls
        check(email, String);
        check(newRole, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to change user role (administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole !== 'admin'){
                // User isn't allowed to change user role, throwing an error
                throw new Meteor.Error('adminAccessDenied', 'Vous devez être administrateur pour effectuer cette action.');
            } else{
                // User is an administrator so he can change the role, checking if the new role is in the list of available roles
                const availableRoles = Rules.user.roles;

                if(!availableRoles.includes(newRole)){
                    // The role isn't in the list of available roles, throwing an error
                    throw new Meteor.Error('roleNotAvailable', 'Le rôle "'+role+'" ne peut pas être sélectionné, veuillez choisir un autre rôle.');
                } else{
                    // The role is available, updating the database
                    // TODO: check if informations really exists

                    UsersInformations.update({email: email}, { $set: {
                        role: newRole
                    }});
                }
            }
        }
    },
    'addUser'({email, role}){
        // Type check to prevent malicious calls
        check(email, String);
        check(role, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to create a new user (administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole !== 'admin'){
                // User isn't allowed to add an user, throwing an error
                throw new Meteor.Error('adminAccessDenied', 'Vous devez être administrateur pour effectuer cette action.');
            } else{
                // User is an administrator, he's allowed to create an user

                // Checking if email is valid
                Meteor.call('checkEmailInput', {email: email}, function(error, result){
                    if(error){
                        // Email address is invalid, throwing an error
                        throw new Meteor.Error('invalidEmail', 'Adresse email invalide.');
                    } else{
                        // Email address is valid, checking if it's not taken by another user
                        Meteor.call('checkIfEmailIsTaken', {email: email}, function(error, isTaken){
                            if(error){
                                // There was an error while checking if email is taken, throwing an error to the client
                                throw new Meteor.Error('checkTakenEmailError', 'Une erreur est survenue lors des vérifications, veuillez réessayer.');
                            } else if(isTaken){
                                // Email address is already taken, throwing an error
                                throw new Meteor.Error('emailAlreadyTaken', 'Cette adresse email est déjà utilisée par un autre utilisateur.');
                            } else{
                                // Email address isn't taken by another user, checking if the role is in the list of available roles
                                const availableRoles = Rules.user.roles;
                                if(!availableRoles.includes(role)){
                                    // The role isn't in the list of possible roles, throwing an error
                                    throw new Meteor.Error('roleNotAvailable', 'Le rôle "'+role+'" ne peut pas être sélectionné, veuillez choisir un autre rôle.');
                                } else{
                                    // The role is available, creating the user

                                    UsersInformations.insert({
                                        userId: '',  // Unknown for the moment, will be updated after registration
                                        username: "",  // Same than userId
                                        email: email,
                                        role: role,
                                        accessAllowed: true
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    }
})
