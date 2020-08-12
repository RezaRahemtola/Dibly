// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './editFooter.html';

// Functions import
import '../../functions/trumbowyg.js';

// Database import
import { Images } from '../../../databases/images.js';


FlowRouter.route('/dashboard/design/footer', {
    name: 'dashboardDesignFooter',
    action(){
        // We will render the edit footer form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'editFooter'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});

Template.editFooter.onRendered(function(){
    // Display the Trumbowyg editor on the given selector
    displayEditorOn('div#editor');

    Meteor.call('getFooter', function(error, footerHTML){
        if(error){
            // TODO: error
        } else{
            // HTML content of the footer was succesfully retrieved, filling the editor
            $('div#editor').trumbowyg('html', footerHTML);
        }
    });

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


Template.editFooter.events({
    'click #submitEditFooter'(event){
        event.preventDefault();

        // Catching inputs for the call :
        document.querySelector('div#editor').click();  // Trigger a click on the editor to transform all canvas to img
        const html = document.querySelector('div#editor').innerHTML;

        Meteor.call('editFooter', {html: html}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Column was modified without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Bas de page modifié avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design');
            }
        });
    }
});


Template.editFooter.helpers({
    displayImage: function(){
        if(Images.findOne({_id: Session.get('currentImageId')}) !== undefined){
            // There is an uploaded image, returning it
            return Images.findOne({_id: Session.get('currentImageId')});
        }
    }
});
