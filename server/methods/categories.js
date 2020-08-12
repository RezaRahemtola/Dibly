// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Categories } from '../../imports/databases/categories.js';
import { Articles } from '../../imports/databases/articles.js';
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
                throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de créer une catégorie.');
            }
        }
    },
    'deleteCategory'({categoryId}){
        // Type check to prevent malicious calls
        check(categoryId, String);

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, catching his role to check if he's allowed to delete a category
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole === 'admin'){
                // User is an administrator, he's allowed to delete a category

                // TODO: check if category really exists

                // Catching category's name to delete it in articles
                const categoryName = Categories.findOne({_id: categoryId}).name;
                // Catching all the articles that contains it
                const articles = Articles.find({categories: categoryName});
                for(var article of articles){
                    // For each article, we remove the category
                    const newCategories = article.categories.filter(function(category){
                        return category !== categoryName;
                    });
                    // Updating the database
                    Articles.update(article._id, { $set: {
                        categories: newCategories
                    }});
                }

                // The category isn't on any article anymore, we can remove it
                Categories.remove({_id: categoryId});

            } else{
                // User isn't allowed to delete this article, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas de créer supprimer une catégorie.");
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
    },
    'getCategoriesForManagement'(){
        // Return all the data of the categories database
        const categoriesCursor = Categories.find();
        var categories = [];
        for(var category of categoriesCursor){
            categories.push(category);
        }
        return categories;
    },
    'getCategoryNameById'({categoryId}){
        // Type check to prevent malicious calls
        check(categoryId, String);

        // TODO: check if the category for this id is defined
        return Categories.findOne({_id: categoryId}).name;
    }
});
