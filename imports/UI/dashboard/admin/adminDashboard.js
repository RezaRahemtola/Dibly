// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './adminDashboard.html';

// JS imports
import './adminUserManagement.js';
import './adminArticlesDashboard.js';


Template.adminDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.adminDashboard.events({
    'click #adminUserManagement'(event){
        event.preventDefault();
        // User management option for administrators is clicked, checking if the current user is really an admin
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
            } else if(role === 'admin'){
                // User is an admin, sending him to user management page
                Session.set('page', 'adminUserManagement');
            } else{
                // Role isn't admin
                // TODO: error message
            }
        });
    },
    'click #adminArticlesDashboard'(event){
        event.preventDefault();
        // Articles dashboard for admin is clicked, checking if the current user is really an admin before sending him to the page
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
            } else if(role === 'admin'){
                // User is an admin, sending him to articles dashboard
                Session.set('page', 'adminArticlesDashboard');
            } else{
                // Role isn't admin
                // TODO: error message
            }
        });
    }
});
