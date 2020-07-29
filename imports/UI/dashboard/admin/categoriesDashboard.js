// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './categoriesDashboard.html';


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
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminCategoriesDashboard'});
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});


Template.adminCategoriesDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
