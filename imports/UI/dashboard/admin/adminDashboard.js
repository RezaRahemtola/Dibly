// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './adminDashboard.html';

// JS imports
import './adminUsersDashboard.js';
import './adminUsersManagement.js';
import './adminArticlesDashboard.js';


Template.adminDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
