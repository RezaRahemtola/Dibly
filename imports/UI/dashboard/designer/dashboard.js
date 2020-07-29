// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './dashboard.html';

// JS import
import './design.js';
import './columns.js';
import './addColumn.js';
import './editColumn.js';


Template.designerDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
