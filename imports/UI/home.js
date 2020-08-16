// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// HTML imports
import './home.html';


Template.home.helpers({
    displayHomePage: function(){
        // Calling a server-side method to catch the home page content
        if(Meteor.subscribe('images').ready()){
            Meteor.call('getDesignValueByName', {name: 'homePage'}, function(error, homePageHTML){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                } else{
                    // Home page HTML content was returned, filling the container with it
                    document.querySelector('div#homePageContainer').innerHTML = homePageHTML;
                }
            });
        }
    }
});
