// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './edit.html';


FlowRouter.route('/dashboard/design/navbar/edit', {
    name: 'dashboardDesignNavbarAdd',
    action(){
        // We will render the edit navbar item form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'editNavbarItem'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});


Template.editNavbarItem.onRendered(function(){
    // Catching the inputs
    const linkInput = document.querySelector('input#link');
    const iconInput = document.querySelector('input#icon');
    const textInput = document.querySelector('input#text');

    // Catching the submit button
    const submitButton = document.querySelector('button#editNavbarItemSubmit');
    submitButton.disabled = true;  // Submit button is disabled until a valid item is chosen

    // Catching the position input & watching for changes
    const positionInput = document.querySelector('input#position');
    positionInput.oninput = function(){
        // Calling a server-side method to get the columns array
        Meteor.call('getDesignValueByName', {name: 'navbarItems'}, function(error, navbarItems){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Empty all the inputs
                linkInput.value = iconInput.value = textInput.value = "";
            } else{
                // Navbar items array was returned, catching the input value
                const position = parseInt(positionInput.value);
                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && navbarItems.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, catching the HTML content
                    const item = navbarItems[position-1];
                    // Replace the content of the inputs
                    linkInput.value = item.href;
                    iconInput.value = item.icon;
                    textInput.value = item.text;
                    // Enable the submit button
                    submitButton.disabled = false;
                } else{
                    // Position isn't an integer or it's corresponding index isn't a valid value
                    // Empty the inputs
                    linkInput.value = iconInput.value = textInput.value = "";
                    // Disable the submit button
                    submitButton.disabled = true;
                }
            }
        });
    }
});


Template.editNavbarItem.events({
    'click #editNavbarItemSubmit'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#editNavbarItemForm'));
        const position = form.get('position');
        const href = form.get('link');
        const icon = form.get('icon');
        const text = form.get('text');

        Meteor.call('editNavbarItem', {position: position, href: href, icon: icon, text: text}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Item was edited without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Élémebt modifié avec succès !", style:"is-success"});
                // Sending user to navbar dashboard
                FlowRouter.go('/dashboard/design/navbar');
            }
        });
    }
});
