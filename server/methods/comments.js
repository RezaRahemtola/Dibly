// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Comments } from '../../imports/databases/comments.js';
import { Articles } from '../../imports/databases/articles.js';
import { UsersInformations } from '../../imports/databases/usersInformations.js';


Meteor.methods({
    'addComment'({articleId, comment, name, email}){
        // Type check to prevent malicious calls
        check(articleId, String);
        check(comment, String);
        check(name, String);
        check(email, String);

        if(Articles.findOne({_id: articleId}) === undefined){
            // The given articleId doesn't corresponds to any article, throwing an error
            throw new Meteor.Error('articleNotFound', "Cet article est introuvable.");
        } else{
            // The article exists, we can continue
            // TODO: check email

            Comments.insert({
                articleId: articleId,
                comment: comment,
                name: name,
                email: email,
                createdAt: new Date
            });
        }
    },
    'deleteComment'({commentId}){
        // Type check to prevent malicious calls
        check(commentId, String);

        if(Comments.findOne({_id: commentId}) === undefined){
            // The given commentId doesn't corresponds to any comment, throwing an error
            throw new Meteor.Error('categoryNotFound', "Ce commentaire est introuvable.");
        } else{
            // The comment exists, we can remove it
            Comments.remove({_id: commentId});
        }
    },
    'showArticleComments'({articleId}){
        // Type check to prevent malicious calls
        check(articleId, String);

        // Create a new array to return the comments
        var comments = [];
        // Catching all the comments for the given articleId
        Comments.find({articleId: articleId}).forEach(function(comment){
            // For each comment we add it's important data to the array

            // Converting the creation date to a classic format
            var year = comment.createdAt.getFullYear();  // Catching the year
            var month = comment.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
            var date = comment.createdAt.getDate();  // Catching the date
            var hours = comment.createdAt.getHours();
            var minutes = comment.createdAt.getMinutes();
            if(date < 10){ date = '0' + date; }  // Formatting the data properly (adding a 0 before if needed)
            if(month < 10){ month = '0' + month; }
            if(hours === 0){ hours = '0' + hours; }
            if(minutes < 10){ minutes = '0' + minutes; }

            // Create a new string with the formatted date
            const createdAt = 'le ' +date+ '/' +month+ '/' +year+ ' à '+hours+ 'h' +minutes;

            comments.push({
                comment: comment.comment,
                name: comment.name,
                createdAt: createdAt
            });
        });

        return comments;
    },
    'getCommentsForManagement'(){
        if(!Meteor.userId()){
            // User isn't logged in, throwing an error message
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, catching his role to check which comment he can manage
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;
            if(userRole === 'author'){
                // User is an author, he can only manage the comments on his articles, catching those articles
                const userArticles = Articles.find({authorId: Meteor.userId()});
                // Creating an array to store the IDs of those articles
                var userArticlesId = [];
                for(var article of userArticles){
                    userArticles.push(article._id);
                }
                // Now let's catch all the comments written in one of those articles
                var commentsCursor = Comments.find({articleId: {$in : userArticlesId}});
            } else if(userRole === 'admin'){
                // User is an administrator, he can manage any comments
                var commentsCursor = Comments.find();
            } else{
                // This user doesn't have the correct role to manage comments, throwing an error message
                throw new Meteor.Error('accessDenied', 'Votre rôle ne vous permet pas de gérer les commentaires.');
            }

            // Creating an array in which we will push the formatted comments
            var comments = [];
            for(var comment of commentsCursor){
                // For each comment we add it's important data to the array

                // Converting the creation date to a classic format
                var year = comment.createdAt.getFullYear();  // Catching the year
                var month = comment.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
                var date = comment.createdAt.getDate();  // Catching the date
                var hours = comment.createdAt.getHours();
                var minutes = comment.createdAt.getMinutes();
                if(date < 10){ date = '0' + date; }  // Formatting the data properly (adding a 0 before if needed)
                if(month < 10){ month = '0' + month; }
                if(hours === 10){ hours = '0' + hours; }
                if(minutes < 10){ minutes = '0' + minutes; }

                // Create a new string with the formatted date
                const createdAt = date+ '/' +month+ '/' +year+ ' à '+hours+ 'h' +minutes;

                // Catching the concerned article title with the id
                const articleTitle = Articles.findOne({_id: comment.articleId}).title;

                comments.push({
                    _id: comment._id,
                    comment: comment.comment,
                    author: comment.name,
                    email: comment.email,
                    article: articleTitle,
                    createdAt: createdAt
                });
            }
            return comments;
        }
    },
    'getCommentToDeleteById'({commentId}){
        // Type check to prevent malicious calls
        check(commentId, String);

        // Catching comment informations
        const comment = Comments.findOne({_id: commentId});

        if(comment === undefined){
            // Comment isn't in our database, throwing an error
            throw new Meteor.Error('commentNotFound', "Ce commentaire est introuvable.");
        } else{

            // Converting the creation date to a classic format
            var year = comment.createdAt.getFullYear();  // Catching the year
            var month = comment.createdAt.getMonth()+1;  // Catching the month (getMonth is 0 indexed so adding 1)
            var date = comment.createdAt.getDate();  // Catching the date
            var hours = comment.createdAt.getHours();
            var minutes = comment.createdAt.getMinutes();
            if(date < 10){ date = '0' + date; }  // Formatting the data properly (adding a 0 before if needed)
            if(month < 10){ month = '0' + month; }
            if(hours === 0){ hours = '0' + hours; }
            if(minutes < 10){ minutes = '0' + minutes; }

            // Create a new string with the formatted date
            const createdAt = date+ '/' +month+ '/' +year+ ' à '+hours+ 'h' +minutes;

            // Creating a new object to return

            return {
                author: comment.name,
                createdAt: createdAt
            }
        }
    }
});
