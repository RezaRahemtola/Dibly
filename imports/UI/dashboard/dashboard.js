// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
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
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render admin dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminDashboard'});
            } else if(role === 'author'){
                // User is an author, we will send him to author dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'authorDashboard'});
            } else if(role === 'designer'){
                // User is a designer, we will send him to designer dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'designerDashboard'});
            }
        });
    }
});


Template.dashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
