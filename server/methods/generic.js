// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Rules } from '../rules.js';
import { Images } from '../../imports/databases/images.js'

// Allow all client-side insertions on the Images collection
Images.allow({ insert() { return true; } } );

// Deny client-side remove on the Images collection
Images.deny({ remove() { return true; } } );


// Publish images collection to allow reading on client
Meteor.publish('images', function(){
    return Images.find().cursor;
});


Meteor.methods({
    'setAccountsSettings'(){

        Accounts.config({
            sendVerificationEmail: true, // Enable verification email
            loginExpirationInDays: null  // Disable login expiration
        });

        // Customizing templates :
        Accounts.emailTemplates.verifyEmail = {
            from(){
                // Defining sending address
                return Meteor.settings.email.verifyEmail.sender;
            },
            subject(){
                return "Activez votre compte";
            },
            html(user, url){
                return `<h3>Bonjour ${user.username},</h3>
                        <br/>
                        <p>Merci pour votre inscription, vous pouvez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous</p>
                        <a href="` + url + `">
                            Vérifier votre adresse e-mail
                        </a>
                        <br/>
                        <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : <a href="` + url + `">`+ url +`</a></p>`;
            }
        };
        Accounts.emailTemplates.resetPassword = {
            from(){
                // Defining sending address
                return Meteor.settings.email.resetPassword.sender;
            },
            subject(){
                return "Réinitialiser votre mot passe";
            },
            html(user, url){
                return `<h3>Bonjour ${user.username},</h3>
                        <br/>
                        <p>Vous avez demandé à réinitialiser votre mot de passe, vous pouvez le faire en cliquant sur le bouton ci-dessous</p>
                        <a href="` + url + `">
                            Réinitialiser votre mot de passe
                        </a>
                        <br/>
                        <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : <a href="` + url + `">`+ url +`</a></p>
                        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>`;
            }
        };
    },
    'sendContactMessage'({email, subject, message}){
        // Type check to prevent malicious calls
        check(email, String);
        check(subject, String);
        check(message, String);

        // TODO: length verifications

        Meteor.call('checkEmailInput', {email: email}, function(error, result){
            if(error){
                // Email is invalid, throwing an error
                throw new Meteor.Error('invalidEmailAddress', "Adresse email invalide.");
            } else{
                // Email address is valid
                const from = Meteor.settings.email.contactForm.sender;
                const to = Meteor.settings.email.contactForm.receiver;
                const emailSubject = "Formulaire de contact";

                // Creating the body content of the email
                const html = `<h3>Sujet: `+ subject +`</h3>
                              <h4>Adresse email : `+ email +`</h4>
                              <p>Message : `+ message +`</p>`;

                // Sending email using SendGrid (https://app.sendgrid.com/guide/integrate/langs/nodejs):

                // Using Twilio SendGrid's v3 Node.js Library (https://github.com/sendgrid/sendgrid-nodejs)
                const sendGrid = require('@sendgrid/mail');
                sendGrid.setApiKey(process.env.SENDGRID_CONTACT_API_KEY);
                sendGrid.send({to: to, from: from, subject: emailSubject, html: html});
            }
        });
    },
    'getGiphyApiKey'(){
        return process.env.GIPHY_API_KEY;
    },
    'removeImage'({imageId}){
        // Type check to prevent malicious calls
        check(imageId, String);

        // TODO: check if file in dropbox before removing
        // TODO: check if image really exists
        Images.remove({_id: imageId});
    },
    'getStatisticsLink'(){
        // Return the link of the statistics page
        return process.env.STATISTICS_LINK;
    },
    'getStatisticsCode'(){
        // Return the HTML code to include in every page for statistics
        return process.env.STATISTICS_CODE;
    }
});
