// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './adminArticlesDashboard.html';


Template.adminArticlesDashboard.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);
});


Template.adminArticlesDashboard.events({
    'click #addArticle'(event){
        event.preventDefault();
        // Add article is clicked, sending user to the page
        Session.set('page', 'addArticle');
    }
});
