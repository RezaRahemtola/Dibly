// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './adminDashboard.html';


Template.adminDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.adminDashboard.events({
    'click #userManagement'(event){
        event.preventDefault();
        // User management option for administrators is clicked, checking if the current user is really an admin
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
            } else if(role === 'admin'){
                // User is an admin, sending him to user management page
                Session.set('page', 'userManagement');
            } else{
                // Role isn't admin
                // TODO: error message
            }
        });
    }
});
