// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './articlePage.html';

// Initializing Session variables
Session.set('currentArticle', {});
Session.set('currentComments', []);

FlowRouter.route('/article/:_id', {
    name: 'articlePage',
    action(params, queryParams){
        // Catching articleId
        const articleId = params['_id'];
        // Retrieving product informations
        Meteor.call('getArticleById', {articleId: articleId}, function(error, article){
            if(error){
                // There was an error
                if(error.error === 'articleNotFound'){
                    // This article isn't in the database, checking if the given param corresponds to the slug of an article
                    Meteor.call('getArticleBySlug', {articleSlug: articleId}, function(error, article){
                        if(error){
                            // There was an error, displaying a message
                            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                            // Sending user back to home page to avoid a blank page displayed
                            FlowRouter.go('/');
                        } else{
                            // Article was successfully retrieved, saving it in a Session variable & displaying the page
                            Session.set('currentArticle', article);
                            BlazeLayout.render('main', {currentPage: 'articlePage'});
                        }
                    });
                } else{
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                    // Sending user back to home page to avoid a blank page displayed
                    FlowRouter.go('/');
                }
            } else{
                // Article was successfully retrieved, saving it in a Session variable & displaying the page
                Session.set('currentArticle', article);
                BlazeLayout.render('main', {currentPage: 'articlePage'});
            }
        });
    }
});


Template.articlePage.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
    // Display the article content inside the container
    document.querySelector('.htmlContainer[id="'+Session.get('currentArticle')._id+'"]').innerHTML = Session.get('currentArticle').html;

    // Catching the comment textarea
    const commentInput = document.querySelector('textarea#comment');
    commentInput.oninput = function(){
        // When a char is added or removed, auto expand the field to display the text correctly
        // Sending mandatory informations only to preserve server resources
        const fieldForServer = {value: commentInput.value, scrollHeight: commentInput.scrollHeight};
        Meteor.call('autoExpand', {field: fieldForServer}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});  // Display an error message
            } else if(result){
                // Result is the height to apply to the field
                commentInput.style.height = result;
            }
        });
    }

    // Live email validation
    const emailInput = document.querySelector('input#email');
    emailInput.onchange = function(){
        Meteor.call('checkEmailInput', {email: emailInput.value}, function(error, result){
            if(!error){
                // Value looks like a valid email adress, removing danger help message
                $('input#email').removeClass("is-danger");
                document.querySelector('#emailField p.help.is-danger').textContent = "";
            } else{
                // Value isn't a valid email adress
                $('input#email').addClass("is-danger");
                document.querySelector('#emailField p.help.is-danger').textContent = "Veuillez entrer une adresse email valide.";  // Adding a danger help message
            }
        });
    }
});


Template.articlePage.helpers({
    displayArticle: function(){
        // Return article informations
        return Session.get('currentArticle');
    },
    displayComments: function(){
        // Return all the comments for the current article

        const articleId = Session.get('currentArticle')._id;

        Meteor.call('showArticleComments', {articleId: articleId}, function(error, commentsArray){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // An array of comments was returned, saving it in a Session variable
                Session.set('currentComments', commentsArray);
            }
        });
        return Session.get('currentComments');
    },
    isOne: function(number){
        return (number === 1) ? true : false;
    }
});


Template.articlePage.events({
    'click #submitComment'(event){
        event.preventDefault();
        // Button to submit a comment is clicked, catching inputs for the call
        const form = new FormData(document.getElementById('commentForm'));
        const comment = form.get('comment');
        const name = form.get('name');
        const email = form.get('email');
        const articleId = Session.get('currentArticle')._id;

        Meteor.call('addComment', {articleId: articleId, comment: comment, name: name, email: email}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});  // Display an error message
            } else{
                // Comment successfully added, reset the form
                document.querySelector('form#commentForm').reset();
                // Display a success message
                Session.set('message', {type:"header", headerContent:"Commentaire publié avec succès.", style:"is-success"});
                // Refreshing the displayed comments by calling the helper
                Template.articlePage.__helpers.get('displayComments').call();
                // Scrolling the window back to the top to make the message visible
                window.scrollTo(0, 0);
            }
        });
    }
});
