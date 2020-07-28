// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './deleteArticle.html';

// Initializing Session variable
Session.set('articlesToDelete', []);


FlowRouter.route('/dashboard/articles/delete', {
    name: 'dashboardDeleteArticle',
    action(){
        // We will render the add article template using Blaze, checking if user is allowed to add an article

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin' || role === 'author'){
                // User can delete an article
                BlazeLayout.render('main', {currentPage: 'deleteArticle'});
            }
        });
    }
});


Template.deleteArticle.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.deleteArticle.helpers({
    'displayArticles': function(){
        Meteor.call('getArticlesToDelete', function(error, articles){
            if(error){
                // TODO: error
            } else{
                Session.set('articlesToDelete', articles);
            }
        });
        return Session.get('articlesToDelete');
    }
});


Template.deleteArticle.events({
    'click .deleteArticle'(event){
        event.preventDefault();

        // Delete article icon is clicked, catching articleId
        const articleId = event.currentTarget.id;
        // Sending user to the confirmation page with articleId in query params
        FlowRouter.go('/dashboard/articles/delete/confirm?articleId='+articleId);
    }
});
