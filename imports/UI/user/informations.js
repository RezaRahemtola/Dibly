// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Database import
import { Images } from '../../databases/images.js';

// HTML import
import './informations.html';


FlowRouter.route('/user/informations', {
    name: 'userInformations',
    action(){
        if(Meteor.userId()){
            // User is connected, render a template using Blaze
            BlazeLayout.render('main', {currentPage: 'userInformations'});
        } else{
            // User isn't connected, showing an error message
            Session.set('message', {type:"header", headerContent:'Veuillez vous connecter pour accéder à cette page.', style:"is-danger"} );
            // Sending user back to home page to avoid a blank page displayed
            FlowRouter.go('/');
        }
    }
});


Template.userInformations.helpers({
    displayUserEmail: function(){
        // Return the user email if available and a blank string if not
        return (Meteor.user()) ? Meteor.user().emails[0].address : " ";
    }
});


Template.userInformations.events({
    'click button#submitEditInformations'(event){
        event.preventDefault();

        // Catching the form element and saving inputs in variables
        const form = new FormData(document.getElementById('editProfileForm'));
        const username = form.get('username');
        const oldPassword = form.get('oldPassword');
        const newPassword = form.get('newPassword');
        const confirmNewPassword = form.get('confirmNewPassword');

        Meteor.call('changeUsername', {newUsername: username}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
            } else{
                // Username updated successfully, checking if user has filled change password fields
                if(oldPassword.length > 0 && newPassword.length > 0 && confirmNewPassword.length > 0){
                    // Password fields were filled
                    Meteor.call('checkPasswordsInput', {password: newPassword, confirmPassword: confirmNewPassword}, function(error, result){
                        if(error){
                            // There is an error in password fields
                            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
                            $('input#newPassword, input#confirmNewPassword').addClass("is-danger");  // Adding a red border to those fields
                        } else{
                            // New passwords match all criteria, changing the current password to the new one
                            Accounts.changePassword(oldPassword, newPassword, function(error){
                                if(error){
                                    // There was an error while changing the password, display a message
                                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                                } else{
                                    // Displaying a success message and sending the user to home page
                                    Session.set('message', {type: "header", headerContent: "Votre profil a été modifié avec succès !", style:"is-success"} );
                                    FlowRouter.go('/');
                                }
                            });
                        }
                    });
                } else{
                    // Displaying a success message and sending the user to home page
                    Session.set('message', {type: "header", headerContent: "Votre profil a été modifié avec succès !", style:"is-success"} );
                    FlowRouter.go('/');
                }
            }
        });
    }
});
