// Useful imports
import { Meteor } from 'meteor/meteor';

// Importing databases
import { Design } from '../../../imports/databases/design.js';
import { UsersInformations } from '../../../imports/databases/usersInformations.js';


Meteor.methods({
    'addMainPageColumn'({position, html}){
        // Type check to prevent malicious calls
        check(position, String);
        check(html, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to add a column (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to add a column, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to add a column, converting the position to integer
                position = parseInt(position);
                // Catching if of columns in the database and the columnsArray
                const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
                var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

                if(isNaN(position)){
                    // Position isn't a number, adding the column at the end
                    columnsArray.push(html);
                } else{
                    // Position is a valid number, adding the column at this position
                    columnsArray.splice(position-1, 0, html);  // Position is in natural format, -1 to have an index
                }

                // Updating the database
                Design.update(columnsId, { $set: {
                    value: columnsArray
                }});
            }
        }
    },
    'editMainPageColumn'({currentPosition, newPosition, html}){
        // Type check to prevent malicious calls
        check(currentPosition, String);
        check(newPosition, String);
        check(html, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit a column (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit a column, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify a column, converting the position to integer
                currentPosition = parseInt(currentPosition);
                // Catching id of columns in the database and the columnsArray
                const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
                var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(currentPosition) && columnsArray.hasOwnProperty(currentPosition-1)){
                    // Position is an integer & the corresponding index exists, we can update the value in the array

                    // Converting the new position to integer to check if it was filled
                    newPosition = parseInt(newPosition);
                    if(isNaN(newPosition)){
                        // New position isn't a number, replace the value at the current position with the new item
                        columnsArray[currentPosition-1] = html;
                    } else{
                        // Position is a valid number, removing the old item & adding the edited column at the new position
                        columnsArray.splice(currentPosition-1, 1);
                        columnsArray.splice(newPosition-1, 0, html);
                    }

                    // Updating the database
                    Design.update(columnsId, { $set: {
                        value: columnsArray
                    }});
                } else{
                    // Position isn't an integer and/or the corresponding index doesn't exists, throwing an error
                    throw new Meteor.Error('invalidPosition', "La position est invalide.");
                }
            }
        }
    },
    'deleteMainPageColumn'({position}){
        // Type check to prevent malicious calls
        check(position, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to delete a column (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to remove a column, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to delete a column, converting the position to integer
                position = parseInt(position);
                // Catching id of columns in the database and the columnsArray
                const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
                var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, we can remove the value from the array
                    columnsArray.splice(position-1, 1);

                    // Updating the database
                    Design.update(columnsId, { $set: {
                        value: columnsArray
                    }});
                } else{
                    // Position isn't an integer and/or the corresponding index doesn't exists, throwing an error
                    throw new Meteor.Error('invalidPosition', "La position est invalide.");
                }
            }
        }
    }
});
