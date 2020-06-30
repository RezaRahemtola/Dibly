// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Rules } from '../rules.js';


Meteor.methods({
    'checkPasswordsInput'({password, confirmPassword}){
        /**
         * Check if a password match all criteria and match it's confirmation
         *
         *  @param  {string}         password   Content of the password input
         *  @param  {string}  confirmPassword   Content of the password confirmation input
         *
         *  @return {boolean}  true if password matched all criteria, else false
         */

        // Type check to prevent malicious calls
        check(password, String);
        check(confirmPassword, String);

        const passwordRules = Rules.user.password;  // Catching password rules
        if(password.length >= passwordRules.minLength && password.length <= passwordRules.maxLength){
            // Password length is correct
            for(var char of passwordRules.forbiddenChars){
                // Checking that the char isn't in the password
                if(password.includes(char)){
                    // A forbidden char is in the password, throwing an error handled in client side
                    throw new Meteor.Error('forbiddenChar', 'Le mot de passe ne peut pas contenir "'+char+'".');
               }
            }
            if(password !== confirmPassword){
                // Passwords don't match, throwing an error handled in client side
                throw new Meteor.Error('differentPasswords', "Les mots de passe ne correspondent pas");
            } else{
                // Password match all criteria
                return true;
            }
        }
        // Password length isn't correct, throwing an error handled in client side
        throw new Meteor.Error('differentPasswords', "La taille du mot de passe n'est pas correcte.");
    },
    'checkEmailInput'({email}){
        /**
         * Check if a text match all criteria
         *
         *  @param  {string}  email   Content of the email input
         *
         *  @return {boolean}  true if the text matched all criteria, else false
         */

        // Type check to prevent malicious calls
        check(email, String);

        // Regular expression to check email from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(email)){
            return true;
        } else{
            throw new Meteor.Error('invalidEmail', 'Adresse email invalide.');
        }
    },
    'checkUrlInput'({url}){
        // Type check to prevent malicious calls
        check(url, String);

        // Regular expression to check URL input from https://w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
        const regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if(regex.test(url)){
            return true;
        } else{
            return false;
        }
    },
    'autoExpand'({field}){

        // Type check to prevent malicious calls
        check(field, Object);

        if(field.value.length === 0){
            // If the field is empty, reset the style height to min-height
             var newHeight = 3 + 'rem';
        } else{
            // Calculate the height based on the scroll height
            var newHeight = field.scrollHeight + 'px';
        }
        return newHeight;
    }
});
