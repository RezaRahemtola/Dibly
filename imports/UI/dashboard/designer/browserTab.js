// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './browserTab.html';

// Database import
import { Images } from '../../../databases/images.js';


FlowRouter.route('/dashboard/design/browser-tab', {
    name: 'dashboardDesignBrowserTab',
    action(){
        // We will render the browser tab form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'browserTabDesign'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});

Template.browserTabDesign.onRendered(function(){
    // Filling the title input with the current tab title
    document.querySelector('input#title').value = document.title;


    // Create an event listener on the file input
    var imageInput = document.querySelector('input#imageInput');
    Session.set('currentImageId', '');  // Reset the variable
    imageInput.onchange = function(){
        if(imageInput.files.length === 1){
            // There is one uploaded file, we transform it to pass it to the server (File object can't be pass)
            for(file of imageInput.files){
                var serverFile = ({size: file.size, type: file.type});
            }
            Meteor.call('checkImageInput', {file: serverFile}, function(error, result){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
                } else{
                    // Image input is correct
                    if(Session.get('currentImageId') !== ''){
                        // There was already an image and it was replaced, removing the old image from the database
                        Meteor.call('removeImage', {imageId: Session.get('currentImageId')}, function(error, result){
                            if(error){
                                // There was an error
                                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
                            } else{
                                // Image was successfully deleted, reset the variable
                                Session.set('currentImageId', '');
                            }
                        });
                    }

                    // Uploading the image
                    const upload = Images.insert({
                        file: imageInput.files[0],
                        streams: 'dynamic',
                        chunkSize: 'dynamic'
                    });
                    upload.on('end', function(error, fileObj){
                        if(error){
                            // There was an error
                            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
                        } else if(fileObj){
                            // The image was succesfully inserted, we can set the current image with the new one
                            Session.set('currentImageId', fileObj._id);
                        }
                    });
                }
            });
        }
    }
});


Template.browserTabDesign.events({
    'click #submitBrowserTabDesign'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#browserTabDesign'));
        const title = form.get('title');
        if(Session.get('currentImageId') !== ''){
            var imageUrl = Images.findOne({_id: Session.get('currentImageId')}).link();
        } else{
            var imageUrl = '';
        }

        Meteor.call('editBrowserTab', {imageUrl: imageUrl, title: title}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Browser tab design was edited without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Apparence de l'onglet du navigateur modifiée avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design');
            }
        });
    }
});


Template.browserTabDesign.helpers({
    displayImage: function(){
        if(Images.findOne({_id: Session.get('currentImageId')}) !== undefined){
            // There is an uploaded image, returning it
            return Images.findOne({_id: Session.get('currentImageId')});
        }
    }
});
