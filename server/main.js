// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import '../imports/databases/_all.js';

// Importing methods
import './methods/_all.js';


Meteor.startup(function(){
    // Code to run on server at startup

    if(Meteor.isDevelopment && Meteor.settings){
        // We are in development mode and settings were given, creating environment variable for email sending
        const { username, password, host, port, isSecure } = Meteor.settings.smtp;
        const scheme = isSecure ? 'smtps' : 'smtp';
        process.env.MAIL_URL = `${scheme}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`;
    }

    // Calling the method to define email settings and templates :
    Meteor.call('setAccountsSettings');
});
