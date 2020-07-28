// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './addUser.html';


Template.addUser.onRendered(function(){
    // Live email validation
    const emailInput = document.querySelector('input#email');
    emailInput.onchange = function(){
        // Value looks like a valid email address, checking if it's already taken
        Meteor.call('checkIfEmailIsTaken', {email: emailInput.value}, function(error, result){
            if(!result){
                // Email isn't already used
                $('input#email').removeClass("is-danger");
                document.querySelector('#emailField p.help.is-danger').textContent = "";  // Removing danger help message
            } else{
                // Email is in our database so new user can't be created
                $('input#email').addClass("is-danger");
                document.querySelector('#emailField p.help.is-danger').textContent = "Cette adresse email ne correspond à aucun compte";  // Adding a danger help message
            }
        });
    }
});


Template.addUser.events({
    'click #addSubmit' (event){
        event.preventDefault();
        $(event.target).addClass("is-loading");  // Add a loading effect to the button
        var form = new FormData(document.getElementById('addUserForm'));
        const email = form.get('email');
        const role = form.get('role');

        // Calling a method to add the new user
        Meteor.call('addUser', {email: email, role: role}, function(error, result){
            if(error){
                // TODO: error
                $(event.target).removeClass("is-loading");  // Remove the loading effect of the button
            } else{
                // User was successfully added, displaying a success message
                // TODO: success message
                FlowRouter.go('/dashboard/users')  // Remove the modal by sending user to the users' dashboard page
            }
        });
    }
});


Template.addUser.helpers({
    messageToDisplay: function(){
        var message = Session.get('message');
        if(message !== null){
            // There is a message to display
            return message.type;  // Return the message to display
        }
    },
    displayRoles: function(){
        Meteor.call('getRoles', function(error, roles){
            if(error){
                // TODO: error
            } else{
                // Available roles were successfully retrieved, saving them in a Session variable
                Session.set('availableRoles', roles);
            }
        });
        return Session.get('availableRoles');
    }
});
