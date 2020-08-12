// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './errorPage.html';


// Create 404 route (catch-all)
FlowRouter.route('*', {
    action(){
        // Show 404 error page
        BlazeLayout.render('main', {currentPage: 'errorPage'});
        // Scrolling the window back to the top
        window.scrollTo(0, 0);
    }
});


Template.errorPage.helpers({
    displayErrorPage: function(){
        // Calling a server-side method to catch the error page content
        if(Meteor.subscribe('images').ready()){
            Meteor.call('getDesignValueByName', {name: 'errorPage'}, function(error, errorPageHTML){
                if(error){
                    // TODO: error
                } else{
                    // Error page HTML content was returned, filling the container with it
                    document.querySelector('div#errorPageContainer').innerHTML = errorPageHTML;
                }
            });
        }
    }
});
