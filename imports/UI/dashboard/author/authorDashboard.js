// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './authorDashboard.html';

// JS import
import './articlesDashboard.js';


Template.authorDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
