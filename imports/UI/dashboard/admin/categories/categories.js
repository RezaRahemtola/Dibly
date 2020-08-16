// Useful imports
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './categories.html';

// JS imports
import './management.js';
import './add.js';
import './edit.js';
import './delete.js';


FlowRouter.route('/dashboard/categories', {
    name: 'dashboardCategories',
    action(){
        // We will render the categories dashboard using Blaze, checking if user is an administrator
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'admin'){
                // User can access the dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'categoriesDashboard'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});
