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

        // TODO: check if user is allowed to add an article

        Articles.insert({
            title: title,
            text: text,
            createdAt: new Date()
        })
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
                text: doc.text
            });
        });

        return articles;
    }
});
