// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './dashboard.html';

// JS imports
import './adminDashboard.js';
import './authorDashboard.js';


Template.dashboard.onCreated(function(){
    // Initializing Session variable
    Session.set('dashboard', '');
});


Template.dashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.dashboard.helpers({
    currentDashboard: function(){
        // Catching user role to display the corresponding dashboard
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
            } else if(role === 'admin'){
                // User is an admin, we will send him to admin dashboard
                Session.set('dashboard', 'adminDashboard');
            } else if(role === 'author'){
                // User is an author, we will send him to author dashboard
                Session.set('dashboard', 'authorDashboard');
            }
        });
        return Session.get('dashboard');
    }
});
