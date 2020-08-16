// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './brand.html';

// Functions import
import '../../../functions/trumbowygText.js';


FlowRouter.route('/dashboard/design/navbar/brand', {
    name: 'dashboardDesignNavbarBrand',
    action(){
        // We will render the brand form using Blaze, but we need the user's role to check if access is allowed
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'navbarBrand'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});

Template.navbarBrand.onRendered(function(){
    // Display the Trumbowyg text editor on the given selector
    displayTextEditorOn('div#editor');

    // Catching the navbar brand current design with a server-side method
    Meteor.call('getDesignValueByName', {name: 'navbarBrand'}, function(error, navbarBrandHTML){
        if(error){
            // There was an error
            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
        } else{
            // HTML content of the brand was succesfully retrieved, filling the editor
            $('div#editor').trumbowyg('html', navbarBrandHTML);
        }
    });
});


Template.navbarBrand.events({
    'click #submitNavbarBrand'(event){
        event.preventDefault();

        // Catching inputs for the call :
        document.querySelector('div#editor').click();  // Trigger a click on the editor to transform all canvas to img
        const html = document.querySelector('div#editor').innerHTML;

        Meteor.call('editNavbarBrand', {html: html}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Navbar brand was modified without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Modification effectuée avec succès !", style:"is-success"});
                // Sending user to the navbar design dashboard
                FlowRouter.go('/dashboard/design');
            }
        });
    }
});
