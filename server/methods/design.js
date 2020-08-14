// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Design } from '../../imports/databases/design.js';
import { Images } from '../../imports/databases/images.js';
import { UsersInformations } from '../../imports/databases/usersInformations.js';


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
    },
    'addMainPageColumn'({position, html}){
        // Type check to prevent malicious calls
        check(position, String);
        check(html, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to add a column (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to add a column, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to add a column, converting the position to integer
                position = parseInt(position);
                // Catching if of columns in the database and the columnsArray
                const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
                var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

                if(isNaN(position)){
                    // Position isn't a number, adding the column at the end
                    columnsArray.push(html);
                } else{
                    // Position is a valid number, adding the column at this position
                    columnsArray.splice(position-1, 0, html);  // Position is in natural format, -1 to have an index
                }

                // Updating the database
                Design.update(columnsId, { $set: {
                    value: columnsArray
                }});
            }
        }
    },
    'editMainPageColumn'({position, html}){
        // Type check to prevent malicious calls
        check(position, String);
        check(html, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit a column (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit a column, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify a column, converting the position to integer
                position = parseInt(position);
                // Catching id of columns in the database and the columnsArray
                const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
                var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, we can update the value in the array
                    columnsArray[position-1] = html;

                    // Updating the database
                    Design.update(columnsId, { $set: {
                        value: columnsArray
                    }});
                } else{
                    // TODO: throw error
                }
            }
        }
    },
    'deleteMainPageColumn'({position}){
        // Type check to prevent malicious calls
        check(position, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to delete a column (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to remove a column, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to delete a column, converting the position to integer
                position = parseInt(position);
                // Catching id of columns in the database and the columnsArray
                const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
                var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, we can remove the value from the array
                    columnsArray.splice(position-1, 1);

                    // Updating the database
                    Design.update(columnsId, { $set: {
                        value: columnsArray
                    }});
                } else{
                    // TODO: throw error
                }
            }
        }
    },
    'editBackground'({imageId, color}){
        // Type check to prevent malicious calls
        check(imageId, String);
        check(color, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to change the background (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit the background, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to edit the background, catching database id
                const backgroundId = Design.findOne({name: 'background'})._id;

                if(imageId !== '' || color !== ''){
                    // At least one background option was given, catching the old image background (if there was one) to delete it
                    const oldBackgroundImage = Design.findOne({name: 'background'}).value.imageId;
                    if(oldBackgroundImage !== ''){
                        // The old background option was an image, deleting it
                        Images.remove({_id: oldBackgroundImage});
                    }

                    // Checking which background option was given
                    if(imageId !== ''){
                        // Image was given, updating the database with it
                        Design.update(backgroundId, { $set: {
                            value: {
                                imageId: imageId,
                                color: ''  // Reset the color so only one background option is set
                            }
                        }});
                    } else if(color !== ''){
                        // Color was given, updating the database with it
                        Design.update(backgroundId, { $set: {
                            value: {
                                imageId: '',  // Reset the imageId so only one background option is set
                                color: color
                            }
                        }});
                    }
                } else{
                    // No background option given, throwing an error
                    throw new Meteor.Error('noBackgroundOption', "Veuillez renseigner une couleur ou une image.");
                }
            }
        }
    },
    'getDesignValueByName'({name}){
        // Type check to prevent malicious calls
        check(name, String);

        // TODO: check if not undefined

        // Catch & return the value of the corresponding element in the database
        return Design.findOne({name: name}).value;
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
                // User is allowed to modify an element, catching it's id with the given name
                const elementId = Design.findOne({name: name})._id;
                // TODO: check if id is defined

                // Updating the database
                Design.update(elementId, { $set: {
                    value: value
                }});
            }
        }
    },
    'editBrowserTab'({imageUrl, title}){
        // Type check to prevent malicious calls
        check(imageUrl, String);
        check(title, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit browser tab elements (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit those elements, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify browser tab title & favicon, catching their id & updating the database
                const browserTitleId = Design.findOne({name: 'browserTitle'})._id;
                // Updating the database
                Design.update(browserTitleId, { $set: {
                    value: title
                }});

                const browserFaviconId = Design.findOne({name: 'browserFavicon'})._id;
                // Updating the database
                Design.update(browserFaviconId, { $set: {
                    value: imageUrl
                }});
            }
        }
    },
    'addNavbarItem'({href, icon, text}){
        // Type check to prevent malicious calls
        check(href, String);
        check(icon, String);
        check(text, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to add an item to the navbar (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to add an item, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to add an item to the navbar, catching the current element & the id
                var navbarItems = Design.findOne({name: 'navbarItems'}).value;
                const navbarItemsId = Design.findOne({name: 'navbarItems'})._id;

                // Push the new item to the array of existing items
                navbarItems.push({
                    href: href,
                    icon: icon,
                    text: text
                });

                // Updating the database
                Design.update(navbarItemsId, { $set: {
                    value: navbarItems
                }});
            }
        }
    },
    'editNavbarItem'({position, href, icon, text}){
        // Type check to prevent malicious calls
        check(position, String);
        check(href, String);
        check(icon, String);
        check(text, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to edit a navbar item (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to edit an item, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to modify a navbar item, converting the position to integer
                position = parseInt(position);
                // Catching id of navbar items in the database and it's value
                const navbarItemsId = Design.findOne({name: 'navbarItems'})._id;
                var navbarItems = Design.findOne({name: 'navbarItems'}).value;

                // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && navbarItems.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, we can update the value in the array
                    navbarItems[position-1] = {href: href, icon: icon, text: text};

                    // Updating the database
                    Design.update(navbarItemsId, { $set: {
                        value: navbarItems
                    }});
                } else{
                    // TODO: throw error
                }
            }
        }
    },
    'deleteNavbarItem'({position}){
        // Type check to prevent malicious calls
        check(position, String);

        if(!Meteor.userId()){
            // User isn't logged in
            throw new Meteor.Error('userNotLoggedIn', 'Utilisateur non-connecté, veuillez vous connecter et réessayer.');
        } else{
            // User is logged in, checking if he is allowed to delete a navbar item (designer or administrator)
            const userRole = UsersInformations.findOne({userId: Meteor.userId()}).role;

            if(userRole !== 'designer' && userRole !== 'admin'){
                // User isn't allowed to remove an item, throwing an error
                throw new Meteor.Error('accessDenied', "Votre rôle ne vous permet pas d'effectuer cette action.");
            } else{
                // User is allowed to delete an item, converting the position to integer
                position = parseInt(position);
                // Catching id of navbar items in the database and the items themselves
                const navbarItemsId = Design.findOne({name: 'navbarItems'})._id;
                var navbarItems = Design.findOne({name: 'navbarItems'}).value;

                // Checking if the position is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
                if(!isNaN(position) && navbarItems.hasOwnProperty(position-1)){
                    // Position is an integer & the corresponding index exists, we can remove the value from the array
                    navbarItems.splice(position-1, 1);

                    // Updating the database
                    Design.update(navbarItemsId, { $set: {
                        value: navbarItems
                    }});
                } else{
                    // TODO: throw error
                }
            }
        }
    }
});
