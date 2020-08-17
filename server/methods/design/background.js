// Useful imports
import { Meteor } from 'meteor/meteor';

// Importing databases
import { Design } from '../../../imports/databases/design.js';
import { Images } from '../../../imports/databases/images.js';
import { UsersInformations } from '../../../imports/databases/usersInformations.js';


Meteor.methods({
    'editBackground'({imageId, color}){
        // Type check to prevent malicious calls
        check(imageId, String);
        check(color, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to change the background (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit the background, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to edit the background, checking if a background option was given

                if(imageId !== '' || color !== ''){
                    // At least one background option was given, catching the old image background (if there was one) to delete it
                    const oldBackgroundImage = Design.findOne({name: 'background'}).value.imageId;
                    if(oldBackgroundImage !== ''){
                        // The old background option was an image, deleting it
                        Images.remove({_id: oldBackgroundImage});
                    }

                    // Checking which background option was given
                    if(imageId !== ''){
                        // Image was given, updating the database with it
                        Design.update({name: 'background'}, { $set: {
                            value: {
                                imageId: imageId,
                                color: ''  // Reset the color so only one background option is set
                            }
                        }});
                    } else if(color !== ''){
                        // Color was given, updating the database with it
                        Design.update({name: 'background'}, { $set: {
                            value: {
                                imageId: '',  // Reset the imageId so only one background option is set
                                color: color
                            }
                        }});
                    }
                } else{
                    // No background option given, throwing an error
                    throw new Meteor.Error('noBackgroundOption', "Veuillez renseigner une couleur ou une image.");
                }
            }
        }
    }
});
