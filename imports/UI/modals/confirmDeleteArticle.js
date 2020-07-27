// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './confirmDeleteArticle.html';

// Initializing Session variable
Session.set('confirmDeleteArticle', {});


FlowRouter.route('/dashboard/articles/delete/confirm', {
    name: 'confirmDeleteArticle',
    action(params, queryParams){
        if(!queryParams['articleId']){
            // articleId wasn't given, showing an error message & sending user back to delete article page
            Session.set('message', {type:"header", headerContent:"Une erreur est survenue lors de la transmission des informations de l'article, veuillez réessayer.", style:"is-danger"});
            FlowRouter.go('/dashboard/articles/delete');
        } else{
            // articleId was given, we can display the confirmation modal
            // Render a template using Blaze
            BlazeLayout.render('main', {currentPage: 'deleteArticle', currentModal: 'confirmDeleteArticle'});
        }
    }
});


Template.confirmDeleteArticle.helpers({
    'getArticleById': function(){
        Meteor.call('getArticleById', {articleId: FlowRouter.getQueryParam('articleId')}, function(error, article){
            if(error){
                // TODO: error
            } else{
                Session.set('confirmDeleteArticle', article);
            }
        });
        return Session.get('confirmDeleteArticle');
    }
});


Template.confirmDeleteArticle.events({
    'click #cancel'(event){
        event.preventDefault();

        // Cancel button is clicked, sending user back to delete articles page
        FlowRouter.go('/dashboard/articles/delete');
    },
    'click #delete'(event){
        event.preventDefault();

        // Delete article button was clicked, calling the method to delete the article
        Meteor.call('deleteArticle', {articleId: FlowRouter.getQueryParam('articleId')}, function(error, result){
            if(error){
                // TODO: error
            } else{
                // Article was successfully deleted, showing a confirmation message and sending user to delete article page
                Session.set('message', {type:"header", headerContent:"L'article a bien été supprimé", style:"is-success"});
                FlowRouter.go('/dashboard/articles/delete');
            }
        });
    }
});
