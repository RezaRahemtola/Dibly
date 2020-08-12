// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './delete.html';

// Initializing Session variable
Session.set('deleteCategoryName', '');


FlowRouter.route('/dashboard/categories/manage/delete/confirm', {
    name: 'deleteCategory',
    action(params, queryParams){
        if(!queryParams['categoryId']){
            // categoryId wasn't given, showing an error message & sending user to the categories management page
            Session.set('message', {type:"header", headerContent:"Une erreur est survenue lors de la transmission des informations de la catégorie, veuillez réessayer.", style:"is-danger"});
            FlowRouter.go('/dashboard/categories/management');
        } else{
            // categoryId was given, we can display the confirmation modal
            // Render a template using Blaze
            BlazeLayout.render('main', {currentPage: 'categoriesManagement', currentModal: 'confirmDeleteCategory'});
        }
    }
});


Template.confirmDeleteCategory.helpers({
    getCategory: function(){
        if(FlowRouter.getQueryParam('categoryId')){
            Meteor.call('getCategoryNameById', {categoryId: FlowRouter.getQueryParam('categoryId')}, function(error, categoryName){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                } else{
                    // Category informations were successfully retrieved, saving them in a Session variable
                    Session.set('deleteCategoryName', categoryName);
                }
            });
            return Session.get('deleteCategoryName');
        }
    }
});


Template.confirmDeleteCategory.events({
    'click #cancel'(event){
        event.preventDefault();

        // Cancel button is clicked, sending user to the categories management page
        FlowRouter.go('/dashboard/categories/manage');
    },
    'click #delete'(event){
        event.preventDefault();

        // Delete category button was clicked, calling the method to delete it
        Meteor.call('deleteCategory', {categoryId: FlowRouter.getQueryParam('categoryId')}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Category successfully deleted, showing a confirmation message and sending user to the categories management page
                Session.set('message', {type:"header", headerContent:"La catégories a bien été supprimé.", style:"is-success"});
                FlowRouter.go('/dashboard/categories/manage');
            }
        });
    }
});
