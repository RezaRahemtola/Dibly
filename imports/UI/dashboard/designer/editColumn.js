// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './editColumn.html';

// Functions import
import '../../functions/trumbowyg.js';


FlowRouter.route('/dashboard/design/columns/edit', {
    name: 'dashboardDesignColumnsEdit',
    action(){
        // We will render the edit column form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'editColumn'});
            }
        });
    }
});

Template.editColumn.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);

    // Display the Trumbowyg editor on the given selector
    displayEditorOn('div#editor');
    $('div#editor').trumbowyg('disable');  // By default editor is disabled

    // Catching the column position input & watching for changes
    const positionInput = document.querySelector('input#position');
    positionInput.oninput = function(){
        // Calling a server-side method to get the columns array
        Meteor.call('getMainPageColumns', function(error, columnsArray){
            if(error){
                // TODO: error
                // Disable & empty the Trumbowyg editor
                $('div#editor').trumbowyg('disable');
                $('#editor').trumbowyg('empty');
            } else{
                // Columns array was returned, catching the input value
                const position = parseInt(positionInput.value);
                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, catching the HTML content
                    const columnHTML = columnsArray[position-1];
                    // Replace the content of the editor & enable it
                    $('div#editor').trumbowyg('html', columnHTML);
                    $('div#editor').trumbowyg('enable');
                } else{
                    // Position isn't an integer or it's corresponding index isn't a valid value
                    // Disable & empty the Trumbowyg editor
                    $('div#editor').trumbowyg('disable');
                    $('#editor').trumbowyg('empty');
                }
            }
        });
    }
});


Template.editColumn.events({
    'click #submitEditColumn'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#editColumn'));
        const position = form.get('position');
        const html = document.querySelector('div#editor').innerHTML;

        Meteor.call('editMainPageColumn', {position: position, html: html}, function(error, result){
            if(error){
                // TODO: error
            } else{
                // Column was modified without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Colonne modifiée avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design/columns');
            }
        });
    }
});
