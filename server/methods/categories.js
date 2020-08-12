// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Categories } from '../../imports/databases/categories.js';
import { UsersInformations } from '../../imports/databases/usersInformations.js';


Meteor.methods({
    'addCategory'({name}){
        // Type check to prevent malicious calls
        check(name, String);

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he's allowed to add a category
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole === 'admin'){
                // User can create a new category, inserting it in the database
                Categories.insert({
                    name: name
                });
            } else{
                // This user has not the correct role to publish an article, throwing an error message
                throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de créer une catégorie');
            }
        }
    },
    'getCategories'(){
        const categoriesCursor = Categories.find();
        var categories = [];
        for(var category of categoriesCursor){
            categories.push(category.name);
        }
        return categories;
    }
});
