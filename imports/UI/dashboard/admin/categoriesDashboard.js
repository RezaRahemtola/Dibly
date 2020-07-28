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
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User can access the dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminCategoriesDashboard'});
            }
        });
    }
});


Template.adminCategoriesDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
