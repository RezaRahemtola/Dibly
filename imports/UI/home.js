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
                    // TODO: error
                } else{
                    // Home page HTML content was returned, filling the container with it
                    document.querySelector('div#homePageContainer').innerHTML = homePageHTML;
                }
            });
        }
    }
});
