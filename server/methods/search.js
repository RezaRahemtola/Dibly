// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Articles } from '../../imports/databases/articles.js';


Meteor.methods({
    'searchForArticles'({text, categories}){
        // Type check to prevent malicious calls
        check(text, String);

        if(!Array.isArray(categories)){
            // Categories isn't an array
            throw new Meteor.Error('categoriesNotArray', 'Une erreur est survenue lors du filtrage par catégories, veuillez réessayer.');
        } else{
            // All parameters are of the correct type
            if(categories.length > 0 && text === ""){
                // User wants to search by categories, returning the articles that contains all the asked categories
                var matchingArticles = Articles.find({categories: { $all: categories } }).fetch();
            } else if(categories.length > 0 && text !== ""){
                // User wants to search a text with categories filter, returning the articles that contains the text and all the asked categories
                var matchingArticles = Articles.find({$text: { $search: text}, categories: { $all: categories } }).fetch();
            } else{
                // No need to filter by categories, returning the articles that match the search query
                var matchingArticles = Articles.find({$text: { $search: text} }).fetch();
            }

            var articles = [];  // Creating a list in which we will push the articles
            // Iterating through the cursor to collect useful data and return the articles in an array instead of the cursor given by find()
            for(var article of matchingArticles){
                // Catching author's username with his userId
                const author = Meteor.users.findOne({_id: article.authorId}).username;

                // Converting the creation date to a classic format
                var year = article.createdAt.getFullYear();  // Catching the year
                var month = article.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
                var date = article.createdAt.getDate();  // Catching the date
                if(date < 10){ date = '0' + date; }  // Formatting the date and the month properly (adding a 0 before if needed)
                if(month < 10){ month = '0' + month; }
                const createdAt = date+ '/' +month+ '/' +year;  // Updating the document with the new creation date

                articles.push({
                    _id: article._id,
                    title: article.title,
                    html: article.html,
                    categories: article.categories,
                    createdAt: createdAt,
                    author: author
                });
            }
            return articles;
        }
    }
});
