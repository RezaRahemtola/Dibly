// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Articles } from '../../imports/databases/articles.js';
import { Comments } from '../../imports/databases/comments.js';
import { Categories } from '../../imports/databases/categories.js';
import { UsersInformations } from '../../imports/databases/usersInformations.js';


Meteor.methods({
    'addArticle'({title, html, categories, slug}){
        // Type check to prevent malicious calls
        check(title, String);
        check(html, String);
        check(slug, String);

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
                    // User can create an article, encoding the slug to remove special characters
                    let encodedSlug = encodeURIComponent(slug);

                    // Inserting it in the database
                    Articles.insert({
                        title: title,
                        html: html,
                        categories: categories,
                        slug: encodedSlug,
                        createdAt: new Date,
                        authorId: Meteor.userId()
                    });
                } else{
                    // This user does't have the correct role to publish an article, throwing an error message
                    throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de publier des articles.');
                }
            }
        }
    },
    'editArticle'({articleId, title, html, categories, slug}){
        // Type check to prevent malicious calls
        check(articleId, String);
        check(title, String);
        check(html, String);
        check(slug, String);

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
                    // User can edit an article, check if this article exists
                    if(Articles.findOne({_id: articleId}) === undefined){
                        // This article isn't in the database, throwing an error
                        throw new Meteor.Error('articleNotFound', "Cet article n'existe pas, veuillez réessayer.");
                    } else{
                        // This article exists, encoding the slug to remove special characters
                        let encodedSlug = encodeURIComponent(slug);

                        // Edit the content in the database
                        Articles.update(articleId, { $set: {
                            title: title,
                            html: html,
                            categories: categories,
                            slug: encodedSlug
                        }});
                    }
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

            if(Articles.findOne({_id: articleId}) === undefined){
                // The given articleId doesn't corresponds to any article, throwing an error
                throw new Meteor.Error('articleNotFound', "Cet article est introuvable.");
            } else{
                // The article exists, we can continue
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
                    // Removing the comments on this article
                    Comments.remove({articleId: articleId});

                    return true;
                }
            }
        }
    },
    'getLatestArticles'(){
        // Return all articles sorted by date of creation

        // Catching the 10 latest articles & iterating through the cursor to collect useful data and return the articles in an array
        var articles = [];
        Articles.find({}, {sort: { createdAt: -1 }, limit: 10}).forEach(function(doc){
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
                slug: doc.slug,
                createdAt: createdAt,
                author: author
            });
        });

        return articles;
    },
    'getArticlesToEditOrDelete'(){
        // Return all articles that the current user is allowed to edit or delete

        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, catching his role
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole === 'author'){
                // User can only edit and delete his own articles, catching them
                var articlesCursor = Articles.find({authorId: Meteor.userId()});
            } else if(userRole === 'admin'){
                // User can edit & delete articles without any restriction, catching all articles
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

        if(article === undefined){
            // Article isn't in our database, throwing an error
            throw new Meteor.Error('articleNotFound', "Cet article est introuvable.");
        } else{
            // Article is in our database, catching author's username with his userId
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
                slug: article.slug,
                createdAt: createdAt,
                author: author
            }
        }
    },
    'getArticleBySlug'({articleSlug}){
        // Type check to prevent malicious calls
        check(articleSlug, String);

        // Catching article informations
        const article = Articles.findOne({slug: articleSlug});

        if(article === undefined){
            // Article isn't in our database, throwing an error
            throw new Meteor.Error('articleNotFound', "Cet article est introuvable.");
        } else{
            // Article is in our database, catching author's username with his userId
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
                _id: article._id,
                title: article.title,
                html: article.html,
                categories: article.categories,
                slug: article.slug,
                createdAt: createdAt,
                author: author
            }
        }
    }
});
