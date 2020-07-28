// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './usersManagement.html';

// Initializing Session variables
Session.set('displayUsersManagement', []);  // Array used to store all users
Session.set('availableRoles', []);  // Array used to store all the available roles


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


Template.adminUsersManagement.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.adminUsersManagement.helpers({
    displayUsers: function(){
        Meteor.call('getUsersForManagement', function(error, users){
            if(error){
                // TODO: error
            } else{
                // Array of users was successfully retrieved, saving it in a Session variable
                Session.set('displayUsersManagement', users);
            }
        });
        return Session.get('displayUsersManagement');
        //document.querySelectorAll('input[name="accessAllowed"]')
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
    },
    checkAccessAllowedInput: function(email){
        // Checking if access is allowed for this user
        Meteor.call('checkIfAccessAllowed', {email: email}, function(error, accessAllowed){
            if(error){
                // TODO: error
            } else{
                // No error has occurred, we check the input & change label value depending on accessAllowed

                // Catching current input & label
                var input = document.querySelector('input[name="accessAllowed"][id="'+email+'"]');
                var label = document.querySelector('label[for="'+email+'"]');

                if(accessAllowed){
                    // Access is allowed for this user, checking the corresponding switch input and changing his label
                    input.checked = true;
                    label.textContent = "Autorisé";
                } else{
                    // Access isn't allowed for this user, we leave the switch unchecked and change the label
                    label.textContent = "Bloqué";
                }

                // Checking the role to disable access changes
                Meteor.call('getUserRole', {email: email}, function(error, role){
                    if(error){
                        // TODO: error
                    } else if(role === 'admin'){
                        // User is an administrator so his access can't be bloqued, disabling switch input
                        input.disabled = true;
                    }
                });

                // Adding an event listener on the input to change remove/allow access to the user
                // There's a problem with the switch class in the table element with the select role, we need to catch click on the label
                label.onclick = function(){
                    // Changing input state
                    input.checked = !input.checked;

                    if(input.checked){
                        // Access was just granted for this user, catching email & updating the database
                        const email = input.id;
                        Meteor.call('allowAccess', {email: email}, function(error, result){
                            if(error){
                                // TODO: error
                            } else{
                                // Database updated, changing the displayed label
                                label.textContent = "Autorisé";
                            }
                        });
                    } else{
                        // Access was just remove for this user, catching email & updating the database
                        const email = input.id;
                        Meteor.call('removeAccess', {email: email}, function(error, result){
                            if(error){
                                // TODO: error
                            } else{
                                // Database updated, changing the displayed label
                                label.textContent = "Bloqué";
                            }
                        });
                    }
                }
            }

        });
    },
    selectUserRole: function(email){
        // Retrieving user role with the given email
        Meteor.call('getUserRole', {email: email}, function(error, role){
            if(error){
                // TODO: error
            } else{
                // Role was successfully returned, set the select value with it
                var select = document.querySelector('select[id="'+email+'"]');
                select.value = role;

                // Adding an event listener on the select to change role of the user
                select.onchange = function(){
                    // Catching user email & the selected role
                    const email = this.id;
                    const newRole = this.value;

                    // Calling a method to update the role in the database
                    Meteor.call('changeRole', {email: email, newRole: newRole}, function(error, result){
                        if(error){
                            // TODO: error
                        } else{
                            // Role was successfully updated
                        }
                    });
                }
            }
        });
    }
});
