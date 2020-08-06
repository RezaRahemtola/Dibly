// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './categoryPage.html';

// Initializing Session variable
Session.set('categoryArticles', []);
Session.set('currentCategoryName', '');


FlowRouter.route('/category/:_id', {
    name: 'categoryPage',
    action(params, queryParams){
        // Catching categoryId
        const categoryId = params['_id'];
        // Retrieving product informations
        Meteor.call('getArticlesByCategoryId', {categoryId: categoryId}, function(error, articles){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else{
                // Articles were successfully retrieved, saving them in a Session variable & displaying the page
                Session.set('categoryArticles', articles);
                BlazeLayout.render('main', {currentPage: 'categoryPage'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            }
        });
    }
});


Template.categoryPage.helpers({
    getCategoryName: function(){
        // Return the name of the category with the id
        Meteor.call('getCategoryNameById', {categoryId: FlowRouter.getParam('_id')}, function(error, name){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Category name was successfully retrieved, saving it in a Session variable
                Session.set('currentCategoryName', name);
            }
        });
        return Session.get('currentCategoryName');
    },
    displayCategoryArticles: function(){
        return Session.get('categoryArticles');
    }
});
