// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './articlePage.html';

// Initializing Session variable
Session.set('currentArticle', {});

FlowRouter.route('/article/:_id', {
    name: 'articlePage',
    action(params, queryParams){
        // Catching articleId
        const articleId = params['_id'];
        // Retrieving product informations
        Meteor.call('getArticleById', {articleId: articleId}, function(error, article){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
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
    'displayArticle': function(){
        // Return article informations
        return Session.get('currentArticle');
    }
});
