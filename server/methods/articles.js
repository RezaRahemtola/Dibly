// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Articles } from '../../imports/databases/articles.js';
import { Categories } from '../../imports/databases/categories.js';
import { UsersInformations } from '../../imports/databases/usersInformations.js';


Meteor.methods({
    'addArticle'({title, html, categories}){
        // Type check to prevent malicious calls
        check(title, String);
        check(html, String);

        if(!Array.isArray(categories)){
            // Categories isn't an array
            throw new Meteor.Error('categoriesNotArray', "Une erreur est survenue lors de l'ajout des catégories, veuillez réessayer.");
        } else{
            // All parameters are of the correct type, checking if user is logged in

            if(!Meteor.userId()){
                // User isn't logged in, throwing an error message
                throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
            } else{
                // User is logged in, checking if he's allowed to add an article
                const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
                if(userRole === 'admin' || userRole === 'author'){
                    // User can create an article, inserting it in the database
                    Articles.insert({
                        title: title,
                        html: html,
                        categories: categories,
                        createdAt: new Date,
                        authorId: Meteor.userId()
                    });
                } else{
                    // This user has not the correct role to publish an article, throwing an error message
                    throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de publier des articles.');
                }
            }
        }
    },
    'deleteArticle'({articleId}){
        // Type check to prevent malicious calls
        check(articleId, String);

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, catching his role to check if he's allowed to delete this article
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            // By default we assume the user isn't allowed to delete this article
            var isAllowed = false;

            if(userRole === 'admin'){
                // User is an administrator, he's allowed to delete the article
                isAllowed = true;
            } else if(userRole === 'author'){
                // User is an author so he's only allowed to delete his own articles, checking if this article was written by him
                const authorId = Articles.findOne({_id: articleId}).authorId;
                // Changing the value of the variable if authorId matches with current user's id
                isAllowed = (authorId === Meteor.userId()) ? true : false;
            }

            if(!isAllowed){
                // User isn't allowed to delete this article, throwing an error
                throw new Meteor.Error('accessDenied', "Vous n'êtes pas autorisé à supprimer cet article.");
            } else{
                // User is allowed to delete this article
                Articles.remove({_id: articleId});

                return true;
            }
        }
    },
    'getLatestArticles'(){
        // Return all articles sorted by date of creation

        // Catching articles
        var articlesCursor = Articles.find({}, {sort: { createdAt: -1 }});

        // Iterating through the cursor to collect useful data and return the articles in an array instead of the cursor given by find()
        var articles = [];
        articlesCursor.forEach(function(doc){
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
    },
    'getArticlesToDelete'(){
        // Return all articles that the current user is allowed to delete

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, catching his role
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole === 'author'){
                // User can only delete his own articles, catching them
                var articlesCursor = Articles.find({authorId: Meteor.userId()});
            } else if(userRole === 'admin'){
                // User can delete articles without any restriction, catching all articles
                var articlesCursor = Articles.find();
            }

            // Creating an array to return the formatted articles
            var articles = [];

            articlesCursor.forEach(function(doc){
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
                    createdAt: createdAt,
                    author: author
                });
            });

            return articles;
        }
    },
    'getArticleById'({articleId}){
        // Type check to prevent malicious calls
        check(articleId, String);

        // Catching article informations
        const article = Articles.findOne({_id: articleId});

        // Catching author's username with his userId
        const author = Meteor.users.findOne({_id: article.authorId}).username;

        // Converting the creation date to a classic format
        var year = article.createdAt.getFullYear();  // Catching the year
        var month = article.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
        var date = article.createdAt.getDate();  // Catching the date
        if(date < 10){ date = '0' + date; }  // Formatting the date and the month properly (adding a 0 before if needed)
        if(month < 10){ month = '0' + month; }
        const createdAt = date+ '/' +month+ '/' +year;  // Updating the document with the new creation date

        // Creating a new object to return
        return {
            _id: articleId,
            title: article.title,
            html: article.html,
            categories: article.categories,
            createdAt: createdAt,
            author: author
        }
    },
    'getArticlesByCategoryId'({categoryId}){
        // Type check to prevent malicious calls
        check(categoryId, String);

        // Catching category name :
        const category = Categories.findOne({_id: categoryId}).name;

        // Catching all articles with this category
        const articlesCursor = Articles.find({categories: category});

        var articles = [];

        articlesCursor.forEach(function(doc){
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
});
