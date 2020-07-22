// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML imports
import './addArticle.html';


Template.addArticle.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);

    // Catching text input
    const textInput = document.querySelector('textarea#text');
    textInput.oninput = function(){
        // When a char is added or removed, auto expand the field to display the text correctly
        // Sending mandatory informations only to preserve server resources
        fieldForServer = {value: textInput.value, scrollHeight: textInput.scrollHeight};
        Meteor.call('autoExpand', {field:fieldForServer}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});  // Display an error message
            } else if(result){
                // Result is the height to apply to the field
                textInput.style.height = result;
            }
        });
    }
});


Template.addArticle.events({
    'click #submitArticle'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.getElementById('newArticle'));
        const title = form.get('title');
        const text = form.get('text');

        Meteor.call('addArticle', {title: title, text: text}, function(error, result){
            if(error){
                // TODO: error
            } else{
                // Article was added without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Article publié avec succès !", style:"is-success"});
                // Sending user to his dashboard
                FlowRouter.go('/dashboard');
            }
        })
    }
});
