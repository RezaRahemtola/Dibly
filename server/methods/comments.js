// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Comments } from '../../imports/databases/comments.js';


Meteor.methods({
    'addComment'({articleId, comment, name, email}){
        // Type check to prevent malicious calls
        check(articleId, String);
        check(comment, String);
        check(name, String);
        check(email, String);

        // TODO: check email
        // TODO: check if articleId really exists in article db

        Comments.insert({
            articleId: articleId,
            comment: comment,
            name: name,
            email: email,
            createdAt: new Date
        });
    },
    'showArticleComments'({articleId}){
        // Type check to prevent malicious calls
        check(articleId, String);

        // Catching all the comments for the given articleId
        const commentsCursor = Comments.find({articleId: articleId});
        // Create a new array to return the comments
        var comments = [];

        for(var comment of commentsCursor){
            // For each comment we add it's important data to the array

            // Catching the date
            const originalDate = comment.createdAt;

            // Converting the creation date to a classic format
            var year = comment.createdAt.getFullYear();  // Catching the year
            var month = comment.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
            var date = comment.createdAt.getDate();  // Catching the date
            if(date < 10){ date = '0' + date; }  // Formatting the date and the month properly (adding a 0 before if needed)
            if(month < 10){ month = '0' + month; }
            var hours = comment.createdAt.getHours();
            var minutes = comment.createdAt.getMinutes();

            // Create a new string with the formatted date
            const createdAt = 'le ' +date+ '/' +month+ '/' +year+ ' à '+hours+ 'h' +minutes;


            comments.push({
                comment: comment.comment,
                name: comment.name,
                createdAt: createdAt
            });
        }

        return comments;
    }
});
