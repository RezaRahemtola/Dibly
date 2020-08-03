// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './dashboard.html';

// JS imports
import './design.js';
import './columns.js';
import './addColumn.js';
import './editColumn.js';
import './deleteColumn.js';
import './background.js';


Template.designerDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
