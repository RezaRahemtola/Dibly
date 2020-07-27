// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './main.html';

// JS imports
import './home.js';
import './404NotFound.js';
import './addArticle.js';
import './deleteArticle.js';
import './addCategory.js';
import './dashboard/dashboard.js';
import './latestArticles.js';
import './contact.js';
import './articleBanner.js';

// Messages imports
import './messages/header.js';
import './messages/verifyEmail.js';

// Modals imports
import './modals/addUser.js';
import './modals/confirmDeleteArticle.js';
import './modals/forgotPassword.js';
import './modals/login.js';
import './modals/register.js';
import './modals/resetPassword.js';

// CSS imports
import './css/navbar.css';
import './css/image.css';
import './css/footer.css';
import './css/generic.css';

// Render layouts directly into the body
BlazeLayout.setRoot('body');


FlowRouter.route('/', {
    name: 'index',
    action(){
        // Render a template using Blaze
        BlazeLayout.render('main', {currentPage: 'home'});
    }
});


Template.main.onCreated(function(){

    // Initializing Session variables
    Session.set('message', null);  // No message to display for the moment

    // Catching giphy api key
    Meteor.call('getGiphyApiKey', function(error, apikey){
        if(error){
            // TODO: error
        } else{
            Session.set('giphyApiKey', apikey);
        }
    });

    if(Session.get('resetPasswordToken') !== null){
        // There's a token to reset the password that has been set
        FlowRouter.go('/resetPassword');  // Display the reset password modal
    }
});


Template.main.helpers({
    currentMessage: function(){
        // Catching current message
        const message = Session.get('message');
        if(message !== null){
            // There is a message to display and no modal is active
            return message.type;  // Return the message to display
        } else if(Meteor.user() && Meteor.user().emails){
            // User is logged in, checking if user's email is verified
            const hasVerifiedEmail = Meteor.user().emails[0].verified;
            if(!hasVerifiedEmail){
                // User email isn't verified, display a warning message
                Session.set('message', {type:"verifyEmail"} );  // Set the message
            }
        }
    }
});


Template.main.events({
    // Global events :
    'click .logout'(event){
        event.preventDefault();
        FlowRouter.go('/');  // Sending user to the home page
        Meteor.logout();  // Log out the user
    },
    'click div.message-header button.delete'(event){
        event.preventDefault();
        // When the closing button of a message is clicked
        Session.set('message', null);  // Remove the message
    },
    'click .modal-card-head .delete, click .modal-background'(event){
        event.preventDefault();
        // When the closing button of a modal is clicked
        FlowRouter.go('/');  // Remove the modal by going back to the home page
    }
});


// jQuery code to display nav menu when burger-menu is clicked (code from https://bulma.io/documentation/components/navbar/)
$(document).ready(function(){
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function(){
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger, .navbar-menu").toggleClass("is-active");
    });
});
