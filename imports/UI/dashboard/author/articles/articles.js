// Useful imports
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './articles.html';

// JS imports
import './add.js';
import './edit.js';
import './delete.js';
import './modals/confirmDelete.js';


FlowRouter.route('/dashboard/articles', {
    name: 'dashboardArticles',
    action(){
        // We will render the articles dashboard template using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'author' || role === 'admin'){
                // User is allowed to access articles dashboard, rendering it
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'articlesDashboard'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});
