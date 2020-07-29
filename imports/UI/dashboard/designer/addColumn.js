// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './addColumn.html';

// Functions import
import '../../functions/trumbowyg.js';


FlowRouter.route('/dashboard/design/columns/add', {
    name: 'dashboardDesignColumnsAdd',
    action(){
        // We will render the add column form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'addColumn'});
            }
        });
    }
});

Template.addColumn.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);

    // Display the Trumbowyg editor on the given selector
    displayEditorOn('div#editor');
});


Template.addColumn.events({
    'click #submitColumn'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#addColumn'));
        const position = form.get('position');
        const html = document.querySelector('div#editor').innerHTML;

        Meteor.call('addMainPageColumn', {position: position, html: html}, function(error, result){
            if(error){
                // TODO: error
            } else{
                // Column was added without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Colonne ajoutée avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design/columns');
            }
        });
    }
});
