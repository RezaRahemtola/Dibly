// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './latestArticles.html';

// Initializing Session variable
Session.set('latestArticles', []);


FlowRouter.route('/latest-articles', {
    name: 'latestArticles',
    action(){
        BlazeLayout.render('main', {currentPage: 'latestArticles'});
        // Scrolling the window back to the top
        window.scrollTo(0, 0);
    }
});


Template.latestArticles.helpers({
    displayLatestArticles: function(){
        // Calling the method to get the articles
        Meteor.call('getLatestArticles', function(error, articles){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Articles were successfully returned, saving them in a Session variable
                Session.set('latestArticles', articles);
            }
        });
        return Session.get('latestArticles');
    }
});
