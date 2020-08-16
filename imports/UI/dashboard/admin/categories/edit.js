// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './edit.html';


FlowRouter.route('/dashboard/categories/manage/edit', {
    name: 'dashboardEditCategory',
    action(params, queryParams){
        if(!queryParams['categoryId']){
            // categoryId wasn't given, showing an error message & sending user to the categories management page
            Session.set('message', {type:"header", headerContent:"Une erreur est survenue lors de la transmission des informations de la catégorie, veuillez réessayer.", style:"is-danger"});
            FlowRouter.go('/dashboard/categories/manage');
        } else{
            // categoryId was given, we can display the confirmation modal, we will render the edit category template using Blaze, checking if user is allowed to edit a category
            Meteor.call('getCurrentUserRole', function(error, role){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                    // Sending user back to home page to avoid a blank page displayed
                    FlowRouter.go('/');
                } else if(role === 'admin'){
                    // User can edit a category
                    BlazeLayout.render('main', {currentPage: 'editCategory'});
                    // Scrolling the window back to the top
                    window.scrollTo(0, 0);
                } else{
                    // User doesn't have the correct role to access this page, sending him back to home page
                    FlowRouter.go('/');
                }
            });
        }
    }
});


Template.editCategory.onRendered(function(){
    // Filling the input with the current category name
    const categoryId = FlowRouter.getQueryParam('categoryId');  // Catching the category id in query params
    // Calling a server-side method to get the corresponding name
    Meteor.call('getCategoryNameById', {categoryId: categoryId}, function(error, categoryName){
        if(error){
            // There was an error
            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
        } else{
            // Category name was successfully retrieved, catching & filling the input
            document.querySelector('input#name').value = categoryName;
        }
    });
});

Template.editCategory.events({
    'click #submitEditCategory'(event){
        event.preventDefault();

        // Catching input for the call :
        const form = new FormData(document.querySelector('form#editCategory'));
        const name = form.get('name');
        const categoryId = FlowRouter.getQueryParam('categoryId');

        Meteor.call('editCategory', {categoryId: categoryId, name: name}, function(error, result){
            if(error){
                // There was an error while adding the category, showing an error message
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Category was edited without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Catégorie modifiée avec succès !", style:"is-success"});
                // Sending user to the categories management dashboard
                FlowRouter.go('/dashboard/categories/manage');
            }
        })
    }
});
