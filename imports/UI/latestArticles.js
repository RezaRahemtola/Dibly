// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML imports
import './latestArticles.html';

// Initializing Session variable
Session.set('latestArticles', []);


Template.latestArticles.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.latestArticles.helpers({
    displayLatestArticles: function(){
        // Calling the method to get the articles
        Meteor.call('getLatestArticles', function(error, articles){
            if(error){
                // TODO: error
            } else{
                // Articles were successfully returned, saving them in a Session variable
                Session.set('latestArticles', articles);
            }
        });
        return Session.get('latestArticles');
    }
});
