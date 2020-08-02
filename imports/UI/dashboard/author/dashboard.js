// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './dashboard.html';

// JS import
import './articlesDashboard.js';
import './addArticle.js';
import './editArticle.js';
import './deleteArticle.js';


Template.authorDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
