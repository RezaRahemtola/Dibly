// Useful imports
import { Meteor } from 'meteor/meteor';

// Importing databases
import { Design } from '../../../imports/databases/design.js';
import { UsersInformations } from '../../../imports/databases/usersInformations.js';


Meteor.methods({
    'editBrowserTab'({imageUrl, title}){
        // Type check to prevent malicious calls
        check(imageUrl, String);
        check(title, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit browser tab elements (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit those elements, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify browser tab title & favicon, updating the database

                Design.update({name: 'browserTitle'}, { $set: {
                    value: title
                }});

                Design.update({name: 'browserFavicon'}, { $set: {
                    value: imageUrl
                }});
            }
        }
    }
});
