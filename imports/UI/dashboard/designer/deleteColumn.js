// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './deleteColumn.html';


FlowRouter.route('/dashboard/design/columns/delete', {
    name: 'dashboardDesignColumnsDelete',
    action(){
        // We will render the delete column form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'deleteColumn'});
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});

Template.deleteColumn.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);

    // Display the Trumbowyg editor
    $('div#editor').trumbowyg({
        lang: 'fr',
        autogrow: true,
        disabled: true,  // Editor is disabled as we don't need to interact with the content
        btns: [
            ['fullscreen']
        ]
    });

    document.querySelector('button#submitDeleteColumn').disabled = true;  // Submit button is disabled until a valid column is chosen

    // Catching the column position input & watching for changes
    const positionInput = document.querySelector('input#position');
    positionInput.oninput = function(){
        // Calling a server-side method to get the columns array
        Meteor.call('getMainPageColumns', function(error, columnsArray){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Empty the Trumbowyg editor
                $('#editor').trumbowyg('empty');
            } else{
                // Columns array was returned, catching the input value
                const position = parseInt(positionInput.value);
                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, catching the HTML content
                    const columnHTML = columnsArray[position-1];
                    // Replace the content of the editor to show the column to delete
                    $('div#editor').trumbowyg('html', columnHTML);
                    // Enable the submit button
                    document.querySelector('button#submitDeleteColumn').disabled = false;
                } else{
                    // Position isn't an integer or it's corresponding index isn't a valid value, disable the submit button & empty the Trumbowyg editor
                    document.querySelector('button#submitDeleteColumn').disabled = true;
                    $('#editor').trumbowyg('empty');
                }
            }
        });
    }
});


Template.deleteColumn.events({
    'click #submitDeleteColumn'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#deleteColumn'));
        const position = form.get('position');

        Meteor.call('deleteMainPageColumn', {position: position}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Column was deleted without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Colonne supprimée avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design/columns');
            }
        });
    }
});
