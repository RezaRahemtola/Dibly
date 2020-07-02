// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './body.html';

// JS imports
import './home.js';
import './userManagement.js';

// Messages imports
import './messages/header.js';
import './messages/verifyEmail.js';

// Modals imports
import './modals/addUser.js';
import './modals/forgotPassword.js';
import './modals/login.js';
import './modals/register.js';
import './modals/resetPassword.js';

// CSS import
import './css/navbar.css';
import './css/image.css';
import './css/footer.css';
import './css/generic.css';


Template.body.onCreated(function(){

    // Initializing Session variables
    Session.set('page', 'home');  // Site loads with home page
    Session.set('navigation', []);  // Used to store page navigation history to use return button
    Session.set('message', null);  // No message to display for the moment

    if(Session.get('modal') === undefined){
        // No modal set (one could have been set by a function executed before the body creation, like Accounts.onResetPasswordLink)
        Session.set('modal', null);  // No modal to display for the moment
    }
});


Template.body.helpers({
    currentPage: function(){
        return Session.get('page');  // Return the page to display
    },
    currentMessage: function(){
        // Catching current message & modal
        const message = Session.get('message');
        const modal = Session.get('modal');
        if(message !== null && modal === null){
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
    },
    currentModal: function(){
        // Return the modal to display if there's one
        if(Session.get('modal') !== null){
            // There is an active modal
            return Session.get('modal');  // Return the modal to display
        }
    },
    userIsAdmin: function(){
        // Checking if user is an administrator
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
            } else{
                // User role was successfully retrieved, saving it in a Session variable
                Session.set('currentUserRole', role);
            }
        });
        return Session.get('currentUserRole') === 'admin';
    }
});


Template.body.events({
    // Global events :
    'click .register'(event){
        event.preventDefault();
        Session.set('modal', 'register');  // Display the register modal
    },
    'click .login'(event){
        event.preventDefault();
        Session.set('modal', 'login');  // Display the login modal
    },
    'click .logout'(event){
        event.preventDefault();
        Session.set('page', 'home');  // Set the page to default
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
        Session.set('modal', null);  // Remove the modal
    },


    // Navbar events
    'click #home'(event){
        event.preventDefault();
        // When the brand of the navbar is clicked
        Session.set('page', 'home');  // Switching page to home
    },


    // Profile dropdown events
    'click #userInformations'(event){
        event.preventDefault();
        Session.set('page', 'userInformations');
    },
    'click #userManagement'(event){
        event.preventDefault();
        // User management option for administrators is clicked, checking if the current user is really an admin
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
            } else if(role === 'admin'){
                // User is an admin, sending him to user management page
                Session.set('page', 'userManagement');
            } else{
                // Role isn't admin
                // TODO: error message
            }
        });
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
