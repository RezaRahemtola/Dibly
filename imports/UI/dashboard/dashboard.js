// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './dashboard.html';

// JS imports
import './admin/adminDashboard.js';
import './author/authorDashboard.js';


FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action(){
        // We will render the dashboard template using Blaze, but we need the user's role to display the right one

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render admin dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminDashboard'});
            } else if(role === 'author'){
                // User is an author, we will send him to author dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'authorDashboard'});
            }
        });
    }
});


FlowRouter.route('/dashboard/articles', {
    name: 'dashboardArticles',
    action(){
        // We will render the articles dashboard template using Blaze, but we need the user's role to display the right one

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render admin dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminArticlesDashboard'});
            } else if(role === 'author'){
                // User is an author, we will send him to author dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'authorArticlesDashboard'});
            }
        });
    }
});


FlowRouter.route('/dashboard/articles/add', {
    name: 'dashboardAddArticle',
    action(){
        // We will render the add article template using Blaze, checking if user is allowed to add an article

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin' || role === 'author'){
                // User can add an article
                BlazeLayout.render('main', {currentPage: 'addArticle'});
            }
        });
    }
});


FlowRouter.route('/dashboard/articles/delete', {
    name: 'dashboardDeleteArticle',
    action(){
        // We will render the add article template using Blaze, checking if user is allowed to add an article

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin' || role === 'author'){
                // User can delete an article
                BlazeLayout.render('main', {currentPage: 'deleteArticle'});
            }
        });
    }
});


FlowRouter.route('/dashboard/users', {
    name: 'dashboardUsers',
    action(){
        // We will render the user dashboard template using Blaze, checking if user is really an administrator

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render admin dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminUsersDashboard'});
            }
        });
    }
});


FlowRouter.route('/dashboard/users/add', {
    name: 'dashboardUsersAdd',
    action(){
        // We will render the modal to add an user using Blaze, checking if user is really an administrator

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render the modal
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminUsersDashboard', currentModal: 'addUser'});
            }
        });
    }
});


FlowRouter.route('/dashboard/users/manage', {
    name: 'dashboardUsersManage',
    action(){
        // We will render the manage users template using Blaze, checking if user is really an administrator

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User is an admin, we will render the template
                BlazeLayout.render('main', {currentPage: 'adminUsersManagement'});
            }
        });
    }
});


FlowRouter.route('/dashboard/categories', {
    name: 'dashboardCategories',
    action(){
        // We will render the categories dashboard using Blaze, checking if user is an administrator
        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin'){
                // User can access the dashboard
                BlazeLayout.render('main', {currentPage: 'dashboard', currentDashboard: 'adminCategoriesDashboard'});
            }
        });
    }
});


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


Template.dashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
