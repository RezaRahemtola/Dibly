// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Rules } from '../rules.js';


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
                return Rules.email.verifyEmail.sender;
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
                return Rules.email.resetPassword.sender;
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
    }
});
