// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './articlesDashboard.html';


FlowRouter.route('/dashboard/articles', {
    name: 'dashboardArticles',
    action(){
        // We will render the articles dashboard template using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'author' || role === 'admin'){
                // User is allowed to access articles dashboard, rendering it
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'articlesDashboard'});
            }
        });
    }
});

Template.articlesDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
