// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './management.html';

// Initializing Session variable
Session.set('categoriesManagement', []);


FlowRouter.route('/dashboard/categories/manage', {
    name: 'dashboardCategoriesManage',
    action(){
        // We will render the manage categories template using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'author' || role === 'admin'){
                // User is allowed to access categories management, rendering it
                BlazeLayout.render('main', {currentPage: 'categoriesManagement'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
                // Calling the method to refresh the list of categories to manage (in case we just deleted or edited one)
                Template.categoriesManagement.__helpers.get('displayCategories').call();
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});


Template.categoriesManagement.helpers({
    displayCategories: function(){
        // Return the categoriesManagement that the current user can manage
        Meteor.call('getCategoriesForManagement', function(error, categories){
            if(error){
                // TODO: error
            } else{
                // Categories were successfully retrieved, saving them in a Session variable
                Session.set('categoriesManagement', categories);
            }
        });
        return Session.get('categoriesManagement');
    }
});


Template.categoriesManagement.events({
    'click .deleteCategory'(event){
        event.preventDefault();

        // Delete category icon is clicked, catching it's id
        const categoryId = event.currentTarget.id;
        // Sending user to the confirmation page with categoryId in query params
        FlowRouter.go('/dashboard/categories/manage/delete/confirm?categoryId='+categoryId);
    }
});
