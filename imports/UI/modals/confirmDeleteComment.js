// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './confirmDeleteComment.html';

// Initializing Session variable
Session.set('confirmDeleteComment', {});


FlowRouter.route('/dashboard/comments/delete/confirm', {
    name: 'confirmDeleteComment',
    action(params, queryParams){
        if(!queryParams['commentId']){
            // commentId wasn't given, showing an error message & sending user to the comments management page
            Session.set('message', {type:"header", headerContent:"Une erreur est survenue lors de la transmission des informations du commentaire, veuillez réessayer.", style:"is-danger"});
            FlowRouter.go('/dashboard/comments');
        } else{
            // commentId was given, we can display the confirmation modal
            // Render a template using Blaze
            BlazeLayout.render('main', {currentPage: 'commentsManagement', currentModal: 'confirmDeleteComment'});
        }
    }
});


Template.confirmDeleteComment.helpers({
    getComment: function(){
        if(FlowRouter.getQueryParam('commentId')){
            Meteor.call('getCommentToDeleteById', {commentId: FlowRouter.getQueryParam('commentId')}, function(error, comment){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                } else{
                    // Comment informations were successfully retrieved, saving them in a Session variable
                    Session.set('confirmDeleteComment', comment);
                }
            });
            return Session.get('confirmDeleteComment');
        }
    }
});


Template.confirmDeleteComment.events({
    'click #cancel'(event){
        event.preventDefault();

        // Cancel button is clicked, sending user to the comment management page
        FlowRouter.go('/dashboard/comments');
    },
    'click #delete'(event){
        event.preventDefault();

        // Delete comment button was clicked, calling the method to delete it
        Meteor.call('deleteComment', {commentId: FlowRouter.getQueryParam('commentId')}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Comment successfully deleted, showing a confirmation message and sending user to the comments management page
                Session.set('message', {type:"header", headerContent:"Le commentaire a bien été supprimé.", style:"is-success"});
                FlowRouter.go('/dashboard/comments');
            }
        });
    }
});
