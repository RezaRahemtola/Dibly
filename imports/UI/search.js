// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './search.html';


FlowRouter.route('/search', {
    name: 'search',
    action(){
        // Render a template using Blaze
        BlazeLayout.render('main', {currentPage: 'search'});
        // Scrolling the window back to the top
        window.scrollTo(0, 0);
    }
});


Template.search.onRendered(function(){
    Session.set("searchedArticles", []);

    // Dynamically check and show selected categories
    const select = document.querySelector("select#categories");  // Catching the select element

    select.onchange = function(){
        var search = Session.get('search');  // Catching the current search
        const selectedOption = select.value;  // Catching the clicked category
        if(selectedOption !== 'add' && !search.categories.includes(selectedOption)){
            // The selected option isn't the default one and isn't already selected, adding it to the filter
            search.categories.push(selectedOption);
            Session.set('search', search);  // Updating the value of the Session variable
        }
        select.value = 'add';  // Reseting the select with the default value
    }
});


Template.search.helpers({
    getSearchQuery: function(){
        // Return the text search query
        return Session.get('search').query;
    },
    displayArticlesResults: function(){
        // Catching asked search parameters for the call
        const searchQuery = Session.get("search").query;
        const searchCategories = Session.get("search").categories;

        Meteor.call('searchForArticles', {text: searchQuery, categories: searchCategories}, function(error, articlesArray){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
            } else{
                // Result is an array of articles, saving it in a Session variable
                Session.set("searchedArticles", articlesArray);
            }
        });
        return Session.get("searchedArticles");
    },
    displayCategories: function(){
        // Display available categories
        Meteor.call('getCategories', function(error, categoriesArray){
            if(error){
                // There was an error
                Session.set('message', {type:'header', headerContent:error.reason, style:"is-danger"});
            } else{
                // Available categories were successfully retrieved, saving them in a Session variable
                Session.set('articleCategories', categoriesArray);
            }
        });
        return Session.get('articleCategories');
    },
    displaySelectedCategories: function(){
        // Returning the categories used to filter the search
        return Session.get('search').categories;
    },
    noResults: function(){
        // Catching results and checking if there's one or more result
        const results = Session.get('searchedArticles');
        // Return true if there's no results
        return (results.length === 0);
    }
});


Template.search.events({
    'submit form#searchForm'(event){
        event.preventDefault();
        // Search form was submitted, catching the current search and updating it's query value
        var search = Session.get('search');
        search.query = document.getElementById("searchBox").value;
        Session.set('search', search);  // Updating the value of the Session variable with the modified search object
    },
    'click a.tag.is-delete'(event){
        event.preventDefault();
        // Link to delete a category tag was cliked
        var search = Session.get('search');  // Catching the array of categories that are already selected
        // Catching the grand parent element of the delete link (delete link is inside tags div which is inside a control div) :
        var tagToRemove = event.currentTarget.parentElement.parentElement;
        // The catagory to remove is the text content of the tag (control div's first elem is tags div, and it's first elem is the tag) :
        var categoryToRemove = tagToRemove.firstElementChild.firstElementChild.innerText;
        var index = search.categories.indexOf(categoryToRemove);  // Catching the index of the category to delete
        search.categories.splice(index, 1);  // Removing the category
        Session.set('search', search);  // Updating the value of the Session variable
        tagToRemove.parentNode.removeChild(tagToRemove);  // Removing the tag
    },
    'click button#filter'(event){
        event.preventDefault();
        // Display or hide the filters on mobile & tablet
        $("#filterContainer").toggleClass("is-hidden-touch");
    }
});
