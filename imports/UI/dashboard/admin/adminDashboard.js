// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './adminDashboard.html';

// JS imports
import './addUser.js';
import './usersDashboard.js';
import './usersManagement.js';
import './categoriesDashboard.js';


Template.adminDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
