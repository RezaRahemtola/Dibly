// Useful imports
import { Meteor } from 'meteor/meteor';

// Importing databases
import { Design } from '../../../imports/databases/design.js';
import { UsersInformations } from '../../../imports/databases/usersInformations.js';


Meteor.methods({
    'addNavbarItem'({position, href, icon, text}){
        // Type check to prevent malicious calls
        check(href, String);
        check(icon, String);
        check(text, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to add an item to the navbar (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to add an item, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to add an item to the navbar, catching the current element & the id
                var navbarItems = Design.findOne({name: 'navbarItems'}).value;
                const navbarItemsId = Design.findOne({name: 'navbarItems'})._id;
                // Creating the new item
                const item = {href: href, icon: icon, text: text};

                // Converting the position to integer
                position = parseInt(position);
                if(isNaN(position)){
                    // Position isn't a number, adding the item at the end
                    navbarItems.push(item);
                } else{
                    // Position is a valid number, adding the item at this position
                    navbarItems.splice(position-1, 0, item);  // Position is in natural format, -1 to have an index
                }

                // Updating the database
                Design.update(navbarItemsId, { $set: {
                    value: navbarItems
                }});
            }
        }
    },
    'editNavbarItem'({currentPosition, newPosition, href, icon, text}){
        // Type check to prevent malicious calls
        check(currentPosition, String);
        check(newPosition, String);
        check(href, String);
        check(icon, String);
        check(text, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit a navbar item (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit an item, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify a navbar item, converting the position to integer
                currentPosition = parseInt(currentPosition);
                // Catching id of navbar items in the database and it's value
                const navbarItemsId = Design.findOne({name: 'navbarItems'})._id;
                var navbarItems = Design.findOne({name: 'navbarItems'}).value;

                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(currentPosition) && navbarItems.hasOwnProperty(currentPosition-1)){
                    // Position is an integer & the corresponding index exists, we can update the value in the array
                    // Creating the new item object
                    const item = {href: href, icon: icon, text: text};
                    // Converting the position to integer to check if it has been filled
                    newPosition = parseInt(newPosition);
                    if(isNaN(newPosition)){
                        // New position isn't a number, updating the value at the same index
                        navbarItems[currentPosition-1] = item;
                    } else{
                        // Position is a valid number, removing the item at the current position and adding the new item at the new position
                        navbarItems.splice(currentPosition-1, 1);
                        navbarItems.splice(newPosition-1, 0, item);
                    }

                    // Updating the database
                    Design.update(navbarItemsId, { $set: {
                        value: navbarItems
                    }});
                } else{
                    // TODO: throw error
                }
            }
        }
    },
    'deleteNavbarItem'({position}){
        // Type check to prevent malicious calls
        check(position, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to delete a navbar item (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to remove an item, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to delete an item, converting the position to integer
                position = parseInt(position);
                // Catching id of navbar items in the database and the items themselves
                const navbarItemsId = Design.findOne({name: 'navbarItems'})._id;
                var navbarItems = Design.findOne({name: 'navbarItems'}).value;

                // Checking if the position is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && navbarItems.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, we can remove the value from the array
                    navbarItems.splice(position-1, 1);

                    // Updating the database
                    Design.update(navbarItemsId, { $set: {
                        value: navbarItems
                    }});
                } else{
                    // TODO: throw error
                }
            }
        }
    }
});
