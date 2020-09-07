// HTML import
import './dashboard.html';

// JS imports
import './users/users.js';
import './categories/categories.js';

// Initializing Session variable
Session.set('statisticsLink', '');

Template.adminDashboard.helpers({
    getStatisticsLink: function(){
        // Return the link of the statistics page
        Meteor.call('getStatisticsLink', function(error, link){
            if(error){
                // TODO: error
            } else{
                // The link was returned, saving it in a Session variable
                Session.set('statisticsLink', link);
            }
        });
        return Session.get('statisticsLink');
    }
})
