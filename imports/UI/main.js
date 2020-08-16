// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './main.html';

// JS imports
import './home.js';
import './search.js';
import './errorPage.js';
import './dashboard/dashboard.js';
import './user/user.js';
import './categoryPage.js';
import './latestArticles.js';
import './contact.js';

// Article pages imports
import './article/articleBanner.js';
import './article/articlePage.js';

// Messages imports
import './messages/header.js';
import './messages/verifyEmail.js';

// CSS import
import './css/_all.js';

// Database import
import { Images } from '../databases/images.js';

// Render layouts directly into the body
BlazeLayout.setRoot('body');


FlowRouter.route('/', {
    name: 'index',
    action(){
        // Render a template using Blaze
        BlazeLayout.render('main', {currentPage: 'home'});
        // Scrolling the window back to the top
        window.scrollTo(0, 0);
    }
});


// Initializing Session variables
Session.set("searchedArticles", [] );  // No search for the moment
Session.set('search', {query: "", categories: []});
Session.set('message', null);  // No message to display for the moment
Session.set('currentImageId', '');  // No image for the moment
Session.set('navbaritems', []);  // No item in the navbar for the moment


Template.main.onCreated(function(){
    // Catching giphy api key
    Meteor.call('getGiphyApiKey', function(error, apikey){
        if(error){
            // There was an error
            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
        } else{
            Session.set('giphyApiKey', apikey);
        }
    });

    if(Session.get('resetPasswordToken') !== null){
        // There's a token to reset the password that has been set
        FlowRouter.go('/resetPassword');  // Display the reset password modal
    }

    // Subscribing to allow operations on the Images database
    Meteor.subscribe('images');
});


Template.main.onRendered(function(){
    // When the page is rendered, checking if user connected
    if(Meteor.userId() && Meteor.user()){
        // User is connected, checking if he's allowed to access the site (access may have been removed but cookies are still logging the user)
        Meteor.call('checkIfAccessAllowed', {email: Meteor.user().emails[0].address}, function(error, isAllowed){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else if(!isAllowed){
                // Access isn't allowed, logout the user and sending him to home page
                FlowRouter.go('/');  // Sending user to the home page
                Meteor.logout()
            }
        });
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
    },
    displayColumns: function(){
        // Calling a server-side method to get the array of columns
        Meteor.call('getDesignValueByName', {name: 'mainPageColumns'}, function(error, columnsArray){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                console.log(error)
            } else{
                // Columns array was returned, catching the container
                var columnsContainer = document.querySelector('#columnsContainer');
                columnsContainer.innerHTML = "";  // Reset it's content
                // Adding each columns to the page
                for(var columnHTML of columnsArray){
                    var column = document.createElement('div');  // Creating a div element
                    column.classList += "column is-full";  // Adding column classes
                    column.style.background = "white";  // White background to overwrite the page background
                    column.innerHTML = columnHTML;  // Adding the HTML content in the column
                    columnsContainer.appendChild(column);  // Adding the column at the last child of the container
                }
            }
        });
    },
    displayBackground: function(){
        // Calling a server-side method to catch the background design
        if(Meteor.subscribe('images').ready()){
            Meteor.call('getDesignValueByName', {name: 'background'}, function(error, background){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                } else{
                    // Background design object was returned, checking if the color or imageUrl is defined
                    if(background.imageId !== ''){
                        // Background image is defined, catching it's URL & updating the body background
                        const imageUrl = Images.findOne({_id: background.imageId}).link();
                        document.body.style.background = "url('"+imageUrl+"') no-repeat";
                        document.body.style.backgroundSize = "cover";
                    } else if(background.color !== ''){
                        // Background color is defined, change the body background
                        document.body.style.background = background.color;
                    }
                }
            });
        }
    },
    displayTitleAndFavicon: function(){
        // Calling a server-side method to catch the title

        Meteor.call('getDesignValueByName', {name: 'browserTitle'}, function(error, title){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Title was returned, updating it in the document
                document.title = title;
            }
        });

        // Now let's catch the favicon link
        if(Meteor.subscribe('images').ready()){
            Meteor.call('getDesignValueByName', {name: 'browserFavicon'}, function(error, faviconLink){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                } else{
                    // Favicon link was returned, updating it in the document
                    document.querySelector("link[rel='icon']").href = faviconLink;
                }
            });
        }
    },
    displayNavbarItems: function(){
        Meteor.call('getDesignValueByName', {name: 'navbarItems'}, function(error, navbarItems){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Navbar items array was returned, saving it in a Session variable
                Session.set('navbarItems', navbarItems);
            }
        });
        return Session.get('navbarItems');
    },
    displayFooter: function(){
        // Calling a server-side method to catch the footer content
        if(Meteor.subscribe('images').ready()){
            Meteor.call('getDesignValueByName', {name: 'footer'}, function(error, footerHTML){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                } else{
                    // Footer HTML content was returned, filling the container with it
                    document.querySelector('div#footerContainer').innerHTML = footerHTML;
                }
            });
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
