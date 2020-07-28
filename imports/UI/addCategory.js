// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './addCategory.html';


FlowRouter.route('/dashboard/categories/add', {
    name: 'dashboardAddCategories',
    action(){
        // We will render the add article template using Blaze, checking if user is allowed to add a new categoty

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User can add a category
                BlazeLayout.render('main', {currentPage: 'addCategory'});
            }
        });
    }
});


Template.addCategory.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.addCategory.events({
    'click #submitCategory'(event){
        event.preventDefault();

        // Catching input for the call :
        const form = new FormData(document.querySelector('form#newCategory'));
        const name = form.get('name');
        console.log(name)

        Meteor.call('addCategory', {name: name}, function(error, result){
            if(error){
                // There was an error while adding the category, showing an error message
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Category was added without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Catégorie ajoutée avec succès !", style:"is-success"});
                // Sending user to his dashboard
                FlowRouter.go('/dashboard/categories');
            }
        })
    }
});
