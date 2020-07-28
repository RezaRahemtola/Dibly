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
                // TODO: error
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
});


Template.articlePage.helpers({
    'displayArticle': function(){
        // Return article informations
        return Session.get('currentArticle');
    }
});
