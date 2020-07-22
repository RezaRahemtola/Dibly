// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Articles } from '../../imports/databases/articles.js';


Meteor.methods({
    'addArticle'({title, text}){
        // Type check to prevent malicious calls
        check(title, String);
        check(text, String);

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
                    text: text,
                    createdAt: new Date,
                    authorId: Meteor.userId()
                });
            } else{
                // This user has not the correct role to publish an article, throwing an error message
                throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de publier des articles.');
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
            articles.push({
                title: doc.title,
                text: doc.text,
                createdAt: doc.createdAt,
                authorId: doc.author
            });
        });

        return articles;
    }
});
