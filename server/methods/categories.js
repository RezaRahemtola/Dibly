// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Categories } from '../../imports/databases/categories.js';
import { Articles } from '../../imports/databases/articles.js';
import { UsersInformations } from '../../imports/databases/usersInformations.js';


Meteor.methods({
    'addCategory'({name, slug}){
        // Type checks to prevent malicious calls
        check(name, String);
        check(slug, String);

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he's allowed to add a category
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole === 'admin'){
                // User can create a new category, encoding the slug to remove special characters
                let encodedSlug = encodeURIComponent(slug);

                // Inserting content in the database
                Categories.insert({name: name, slug: encodedSlug});
            } else{
                // This user has not the correct role to publish an article, throwing an error message
                throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de créer une catégorie.');
            }
        }
    },
    'editCategory'({categoryId, name, slug}){
        // Type checks to prevent malicious calls
        check(categoryId, String);
        check(name, String);
        check(slug, String);

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, catching his role to check if he's allowed to delete a category
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole === 'admin'){
                // User is an administrator, he's allowed to edit a category

                if(Categories.findOne({_id: categoryId}) === undefined){
                    // The given categoryId doesn't corresponds to any category, throwing an error
                    throw new Meteor.Error('categoryNotFound', "Cette catégorie est introuvable.");
                } else{
                    // The category exists, encoding the slug to remove special characters
                   let encodedSlug = encodeURIComponent(slug);

                    // Catching current name to edit the category in all articles that contains it
                    const currentCategoryName = Categories.findOne({_id: categoryId}).name;
                    // Catching all the articles that contains it
                    Articles.find({categories: currentCategoryName}).forEach(function(article){
                        // For each article, we remove the category
                        var newCategories = article.categories.filter(function(category){
                            return category !== currentCategoryName;
                        });
                        // Add the updated category
                        newCategories.push(name);
                        // Updating the database
                        Articles.update({_id: article._id}, { $set: { categories: newCategories } });
                    });

                    // The old category isn't on any article anymore, we can edit it
                    Categories.update({_id: categoryId}, { $set: { name: name, slug: encodedSlug } });
                }
            } else{
                // User isn't allowed to edit a category, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas de modifier une catégorie.");
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

                if(Categories.findOne({_id: categoryId}) === undefined){
                    // The given categoryId doesn't corresponds to any category, throwing an error
                    throw new Meteor.Error('categoryNotFound', "Cette catégorie est introuvable.");
                } else{
                    // The category exists, catching it's name to delete it in articles
                    const categoryName = Categories.findOne({_id: categoryId}).name;
                    // Catching all the articles that contains it
                    Articles.find({categories: categoryName}).forEach(function(article){
                        // For each article, we remove the category
                        const newCategories = article.categories.filter(function(category){
                            return category !== categoryName;
                        });
                        // Updating the database
                        Articles.update({_id: article._id}, { $set: {
                            categories: newCategories
                        }});
                    });

                    // The category isn't on any article anymore, we can remove it
                    Categories.remove({_id: categoryId});
                }
            } else{
                // User isn't allowed to delete this category, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas de créer supprimer une catégorie.");
            }
        }
    },
    'getCategories'(){
        // Return the names of all the categories
        var categories = [];
        Categories.find().forEach(function(category){
            categories.push(category.name);
        });

        return categories;
    },
    'getCategoriesForManagement'(){
        // Return all the data of the categories database
        var categories = [];
        Categories.find().forEach(function(category){
            categories.push(category);
        });

        return categories;
    },
    'getCategoryNameById'({categoryId}){
        // Type check to prevent malicious calls
        check(categoryId, String);

        if(Categories.findOne({_id: categoryId}) === undefined){
            // The given categoryId doesn't corresponds to any category, throwing an error
            throw new Meteor.Error('categoryNotFound', "Cette catégorie est introuvable.");
        } else{
            // The category exists, we can find and return it's name
            return Categories.findOne({_id: categoryId}).name;
        }
    },
    'getArticlesByCategoryIdOrSlug'({categoryId}){
        // Type check to prevent malicious calls
        check(categoryId, String);

        if(Categories.findOne({_id: categoryId}) === undefined && Categories.findOne({slug: categoryId}) === undefined){
            // The given id/slug doesn't corresponds to any category, throwing an error
            throw new Meteor.Error('categoryNotFound', "Cette catégorie est introuvable.");
        } else{
            // The category exists, catching it's name :
            const category = (Categories.findOne({_id: categoryId}) || Categories.findOne({slug: categoryId})).name;
            // Creating an array to store the articles' data
            var articles = [];
            // Catching all articles with this category
            Articles.find({categories: category}).forEach(function(doc){
                // Catching author's username with his userId
                const author = Meteor.users.findOne({_id: doc.authorId}).username;

                // Converting the creation date to a classic format
                var year = doc.createdAt.getFullYear();  // Catching the year
                var month = doc.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
                var date = doc.createdAt.getDate();  // Catching the date
                if(date < 10){ date = '0' + date; }  // Formatting the date and the month properly (adding a 0 before if needed)
                if(month < 10){ month = '0' + month; }
                const createdAt = date+ '/' +month+ '/' +year;  // Updating the document with the new creation date

                articles.push({
                    _id: doc._id,
                    title: doc.title,
                    html: doc.html,
                    categories: doc.categories,
                    createdAt: createdAt,
                    author: author
                });
            });

            return articles;
        }
    },
    'getCategorySlugById'({categoryId}){
        // Type check to prevent malicious calls
        check(categoryId, String);

        if(Categories.findOne({_id: categoryId}) === undefined){
            // The given id doesn't corresponds to any category, throwing an error
            throw new Meteor.Error('categoryNotFound', "Cette catégorie est introuvable.");
        } else{
            // The category exists, return it's slug
            return Categories.findOne({_id: categoryId}).slug;
        }
    },
    'getCategoryNameBySlug'({slug}){
        // Type check to prevent malicious calls
        check(slug, String);

        if(Categories.findOne({slug: slug}) === undefined){
            // The given slug doesn't corresponds to anu category, throwing an error
            throw new Meteor.Error('categoryNotFound', 'Cette catégorie est introuvable.');
        } else{
            // The category exists, return it's name
            return Categories.findOne({slug: slug}).name;
        }
    }
});
