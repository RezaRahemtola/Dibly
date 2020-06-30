// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML imports
import './home.html';


Template.home.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});
