// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './management.html';

// JS import
import './modals/confirmDelete.js';

// Initializing Session variable
Session.set('commentsManagement', []);


FlowRouter.route('/dashboard/comments', {
    name: 'dashboardComments',
    action(){
        // We will render the comments management template using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'author' || role === 'admin'){
                // User is allowed to access comments management, rendering it
                BlazeLayout.render('main', {currentPage: 'commentsManagement'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
                // Calling the method to refresh the list of comments to manage (in case we just deleted or edited one)
                Template.commentsManagement.__helpers.get('displayComments').call();
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});


Template.commentsManagement.helpers({
    displayComments: function(){
        // Return the comments that the current user can manage
        Meteor.call('getCommentsForManagement', function(error, comments){
            if(error){
                // TODO: error
            } else{
                // Comments were successfully retrieved, saving them in a Session variable
                Session.set('commentsManagement', comments);
            }
        });
        return Session.get('commentsManagement');
    }
});
