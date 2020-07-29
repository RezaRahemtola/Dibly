// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './columns.html';


FlowRouter.route('/dashboard/design/columns', {
    name: 'dashboardDesignColumns',
    action(){
        // We will render the columns design dashboard template using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access columns design dashboard, rendering it
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'columnsDashboard'});
            }
        });
    }
});

Template.articlesDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
