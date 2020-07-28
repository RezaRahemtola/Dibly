// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './usersDashboard.html';


FlowRouter.route('/dashboard/users', {
    name: 'dashboardUsers',
    action(){
        // We will render the user dashboard template using Blaze, checking if user is really an administrator

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render admin dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminUsersDashboard'});
            }
        });
    }
});
