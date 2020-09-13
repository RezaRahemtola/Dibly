// Useful import
import { Template } from 'meteor/templating';

// HTML import
import './header.html';


Template.header.helpers({
    messageToDisplay: function(){
        return Session.get('message');
    }
});
