// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


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
    }
})
