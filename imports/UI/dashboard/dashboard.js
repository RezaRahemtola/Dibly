// Useful imports
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './dashboard.html';

// JS imports
import './admin/dashboard.js';
import './author/dashboard.js';
import './designer/dashboard.js';


FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action(){
        // We will render the dashboard template using Blaze, but we need the user's role to display the right one

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else{
                // User role was returned, render the corresponding dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: role+'Dashboard'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            }
        });
    }
});
