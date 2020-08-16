// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Design } from '../../../imports/databases/design.js';
import { Images } from '../../../imports/databases/images.js';
import { UsersInformations } from '../../../imports/databases/usersInformations.js';

// JS imports
import './background.js';
import './browserTab.js';
import './columns.js';
import './navbar.js';


Meteor.methods({
    'setBasicDesign'(){
        // Fill the Design collection with basic informations
        if(Design.findOne({name: 'mainPageColumns'}) === undefined){
            // Main page columns design isn't set, inserting it in the database
            Design.insert({
                name: 'mainPageColumns',
                value: []  // No column for the moment so we set an empty array
            });
        }
        if(Design.findOne({name: 'background'}) === undefined){
            // Background design isn't defined, inserting it in the database
            Design.insert({
                name: 'background',
                value: {
                    imageId: '',
                    color : '#fff'  // By default the background is white
                }
            });
        }
        if(Design.findOne({name: 'footer'}) === undefined){
            // Footer design isn't defined, inserting example data in the database
            Design.insert({
                name: 'footer',
                value: `<p class="has-text-centered" style="font-family: 'Changa One'; background-color: #f3f3f3;">
                        <span>Site réalisé par </span>
                        <a href="https://rezarahemtola.com" target="_blank" class="link" style="font-family: 'Changa One';">Reza Rahemtola</a>
                        </p>`
            });
        }
        if(Design.findOne({name: 'homePage'}) === undefined){
            // Home page design isn't defined, inserting example data in the database
            Design.insert({
                name: 'homePage',
                value: `<h2 class="title is-2 has-text-centered">Welcome to my blog !</h2>
                        <p class="subtitle has-text-centered">This is the home page</p>`
            });
        }
        if(Design.findOne({name: 'errorPage'}) === undefined){
            // Error page design isn't defined, inserting example data in the database
            Design.insert({
                name: 'errorPage',
                value: `<h3 class="title is-3 has-text-centered">Oops, something went wrong</h3>
                        <p class="has-text-centered">
                            An error has occurred, please try to
                            <a href="#" onclick="window.location.href=window.location.href">
                                reload this page
                            </a>
                            or come back to the
                            <a href="/">home page</a>.
                        </p>`
            });
        }
        if(Design.findOne({name: 'browserTitle'}) === undefined){
            // Title for the browser tab isn't defined,inserting blank data in the database
            Design.insert({
                name: 'browserTitle',
                value: ''
            });
        }
        if(Design.findOne({name: 'browserFavicon'}) === undefined){
            // Favicon for the browser tab isn't defined, inserting blank data in the database
            Design.insert({
                name: 'browserFavicon',
                value: ''
            });
        }
        if(Design.findOne({name: 'navbarItems'}) === undefined){
            // Navbar items aren't defined, inserting example data in the database
            Design.insert({
                name: 'navbarItems',
                value: [
                    {href: "/latest-articles", icon: "fas fa-file-alt", text: "Nos derniers articles"},
                    {href: "/search", icon: "fas fa-search", text: "Rechercher"},
                    {href: "/contact", icon: "fas fa-edit", text: "Contact"}
                ]
            });
        }
        if(Design.findOne({name: 'navbarBrand'}) === undefined){
            // Navbar brand isn't defined, inserting example data in the database
            Design.insert({
                name: 'navbarBrand',
                value: `<h3 class="title is-3 is-family-monospace">Dibly</h3>`
            });
        }
    },
    'getDesignValueByName'({name}){
        // Type check to prevent malicious calls
        check(name, String);

        if(Design.findOne({name: name}) === undefined){
            // The given name doesn't corresponds to any design, throwing an error
            throw new Meteor.Error('designNotFound', "Ce design est introuvable.");
        } else{
            // The design exists, catch & return the value of the corresponding element in the database
            return Design.findOne({name: name}).value;
        }
    },
    'editElement'({name, value}){
        // Type check to prevent malicious calls
        check(name, String);
        check(value, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit an element (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit an element, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify an element, checking if the design exists

                if(Design.findOne({name: name}) === undefined){
                    // The given name doesn't corresponds to any design, throwing an error
                    throw new Meteor.Error('designNotFound', "Ce design est introuvable.");
                } else{
                    // The design exists, catching the corresponding id in the database
                    const elementId = Design.findOne({name: name})._id;

                    // Updating the database
                    Design.update(elementId, { $set: {
                        value: value
                    }});
                }
            }
        }
    }
});
