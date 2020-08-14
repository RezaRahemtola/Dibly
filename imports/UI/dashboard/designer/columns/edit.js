// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './edit.html';

// Functions import
import '../../../functions/trumbowyg.js';

// Database import
import { Images } from '../../../../databases/images.js';


FlowRouter.route('/dashboard/design/columns/edit', {
    name: 'dashboardDesignColumnsEdit',
    action(){
        // We will render the edit column form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'editColumn'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});

Template.editColumn.onRendered(function(){
    // Display the Trumbowyg editor on the given selector
    displayEditorOn('div#editor');
    $('div#editor').trumbowyg('disable');  // By default editor is disabled
    document.querySelector('button#submitEditColumn').disabled = true;  // Submit button is disabled until a valid column is chosen

    // Catching the column position input & watching for changes
    const positionInput = document.querySelector('input#position');
    positionInput.oninput = function(){
        // Calling a server-side method to get the columns array
        Meteor.call('getDesignValueByName', {name: 'mainPageColumns'}, function(error, columnsArray){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Disable & empty the Trumbowyg editor
                $('div#editor').trumbowyg('disable');
                $('#editor').trumbowyg('empty');
            } else{
                // Columns array was returned, catching the input value
                const position = parseInt(positionInput.value);
                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, catching the HTML content
                    const columnHTML = columnsArray[position-1];
                    // Replace the content of the editor & enable it
                    $('div#editor').trumbowyg('html', columnHTML);
                    $('div#editor').trumbowyg('enable');
                    // Enable the submit button
                    document.querySelector('button#submitEditColumn').disabled = false;
                } else{
                    // Position isn't an integer or it's corresponding index isn't a valid value
                    // Disable & empty the Trumbowyg editor
                    $('div#editor').trumbowyg('disable');
                    $('#editor').trumbowyg('empty');
                    // Disable the submit button
                    document.querySelector('button#submitEditColumn').disabled = true;
                }
            }
        });
    }

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


Template.editColumn.events({
    'click #submitEditColumn'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.querySelector('form#editColumn'));
        const position = form.get('position');
        document.querySelector('div#editor').click();  // Trigger a click on the editor to transform all canvas to img
        const html = document.querySelector('div#editor').innerHTML;

        Meteor.call('editMainPageColumn', {position: position, html: html}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Column was modified without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Colonne modifiée avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design/columns');
            }
        });
    }
});


Template.editColumn.helpers({
    displayImage: function(){
        if(Images.findOne({_id: Session.get('currentImageId')}) !== undefined){
            // There is an uploaded image, returning it
            return Images.findOne({_id: Session.get('currentImageId')});
        }
    }
});
