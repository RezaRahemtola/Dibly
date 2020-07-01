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

        if(Meteor.user()){
            // If user is logged in, check if username exists and if it's different than current user's
            return (Meteor.users.findOne({username: username}) && username !== Meteor.user().username) ? true : false;
        } else{
            // Only check if username exists
            return (Meteor.users.findOne({username: username})) ? true : false;
        }
    },
    'checkIfEmailIsTaken'({email}){
        // Type check to prevent malicious calls
        check(email, String);

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
                // There's at least one user (administrator), so this new user was created by him and already has some informations in the database, retrieving the id
                const usersInformationsId = UsersInformations.findOne({email: email})._id;

                // Updating informations with userId & username
                UsersInformations.update(usersInformationsId, { $set: {
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

        // Find and return role of the corresponding user
        return UsersInformations.findOne({email: email}).role;
    },
    'getUsersForManagement'(){
        // TODO: move to a file for admin methods

        // TODO: check if user is admin

        // Catching the list of all users
        const usersCursor = UsersInformations.find();
        // Initializing an array to return informations in a proper format
        var usersInformations = [];

        usersCursor.forEach(function(doc){
            usersInformations.push({
                userId: doc.userId,
                username: doc.username,
                email: doc.email,
                role: doc.role,
                accessAllowed: doc.accessAllowed
            })
        });

        return usersInformations;
    },
    'allowAccess'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        // TODO: check if user is admin

        // Catching id to update the database
        const informationsId = UsersInformations.findOne({email: email})._id;

        UsersInformations.update(informationsId, { $set: {
            accessAllowed: true
        }});
    },
    'removeAccess'({email}){
        // Type check to prevent malicious calls
        check(email, String);

        // TODO: check if user is admin

        // Catching id to update the database
        const informationsId = UsersInformations.findOne({email: email})._id;

        UsersInformations.update(informationsId, { $set: {
            accessAllowed: false
        }});
    }
})
