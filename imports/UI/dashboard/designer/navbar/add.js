// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './add.html';


FlowRouter.route('/dashboard/design/navbar/add', {
    name: 'dashboardDesignNavbarAdd',
    action(){
        // We will render the add navbar item form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'addNavbarItem'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});


Template.addNavbarItem.events({
    'click #addNavbarItemSubmit'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#addNavbarItemForm'));
        const href = form.get('link');
        const icon = form.get('icon');
        const text = form.get('text');

        Meteor.call('addNavbarItem', {href: href, icon: icon, text: text}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Item was added without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Élémebt ajouté avec succès !", style:"is-success"});
                // Sending user to navbar dashboard
                FlowRouter.go('/dashboard/design/navbar');
            }
        });
    }
});
