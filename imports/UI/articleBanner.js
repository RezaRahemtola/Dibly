// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML import
import './articleBanner.html';


Template.articleBanner.onRendered(function(){
    document.querySelector('.htmlContainer#'+this.data._id).innerHTML = this.data.html;
});
