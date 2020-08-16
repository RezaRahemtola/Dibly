// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './edit.html';

// Functions import
import '../../../functions/trumbowyg.js';

// Database import
import { Images } from '../../../../databases/images.js';

// Initializing Session variable
Session.set('articlesToEdit', []);


FlowRouter.route('/dashboard/articles/edit', {
    name: 'dashboardChooseArticleToEdit',
    action(){
        // We will render the edit article template using Blaze, checking if user is allowed to add an article

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'admin' || role === 'author'){
                // User can edit an article, sending him to the page to choose the article
                BlazeLayout.render('main', {currentPage: 'chooseArticleToEdit'});
                // Scrolling the window back to the top
                window.scrollTo(0, 0);
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});


Template.chooseArticleToEdit.helpers({
    displayArticles: function(){
        Meteor.call('getArticlesToEditOrDelete', function(error, articles){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Articles were successfully retrieved, saving them in a Session variable
                Session.set('articlesToEdit', articles);
            }
        });
        return Session.get('articlesToEdit');
    }
});


FlowRouter.route('/dashboard/articles/edit/:_id', {
    name: 'dashboardEditArticle',
    action(params, queryParams){
        // We will render the edit article template using Blaze, checking if user is allowed to add an article
        const articleId = params['_id'];

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                // Sending user back to home page to avoid a blank page displayed
                FlowRouter.go('/');
            } else if(role === 'admin' || role === 'author'){
                // User can edit an article, catching the article with the given id
                Meteor.call('getArticleById', {articleId: articleId}, function(error, article){
                    if(error){
                        // There was an error
                        Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
                    } else{
                        // Article was successfully retrieved, sendind user to edit article page
                        Session.set('currentArticle', article);
                        BlazeLayout.render('main', {currentPage: 'editArticle'});
                    }
                });
            } else{
                // User doesn't have the correct role to access this page, sending him back to home page
                FlowRouter.go('/');
            }
        });
    }
});

Template.editArticle.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);

    // Catching article's informations
    const article = Session.get('currentArticle');

    // Fill the title
    document.querySelector('input#title').value = article.title;

    // Dynamically check and show selected categories
    Session.set('selectedCategories', article.categories);
    const select = document.querySelector("select#categories");  // Catching the select element
    select.onchange = function(){
        var selectedCategories = Session.get('selectedCategories');  // Catching the array of categories that are already selected
        const selectedOption = select.value;  // Catch the value attribute of the selected option
        if(selectedOption !== 'add' && !selectedCategories.includes(selectedOption)){
            // The selected option isn't the default one and isn't already selected, displaying the category tag
            selectedCategories.push(selectedOption);  // Adding the category to the selected ones
            Session.set('selectedCategories', selectedCategories);  // Updating the value of the Session variable
        }
        select.value = 'add';  // Reseting the select with the default value
    }

    // Display the Trumbowyg editor on the given selector
    displayEditorOn('div#editor');
    // Fill it with the content of the article
    $('div#editor').trumbowyg('html', article.html);


    // Create an event listener on the file input
    var imageInput = document.querySelector('input#imageInput');
    Session.set('currentImageId', '');  // Reset the variable
    imageInput.onchange = function(){
        if(imageInput.files.length === 1){
            // There is one uploaded file, we transform it to pass it to the server (File object can't be pass)
            for(file of imageInput.files){
                var serverFile = ({size: file.size, type: file.type});
            }
            Meteor.call('checkImageInput', {file: serverFile}, function(error, result){
                if(error){
                    // There was an error
                    Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
                } else{

                    const upload = Images.insert({
                        file: imageInput.files[0],
                        streams: 'dynamic',
                        chunkSize: 'dynamic'
                    });
                    upload.on('end', function(error, fileObj){
                        if(error){
                            // There was an error
                            Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"} );  // Display an error message
                        } else if(fileObj){
                            // The image was succesfully inserted, we can set the current image with the new one
                            Session.set('currentImageId', fileObj._id);
                        }
                    });
                }
            });
        }
    }
});


Template.editArticle.events({
    'click #submitEditArticle'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const articleId = Session.get('currentArticle')._id;
        const form = new FormData(document.getElementById('editArticle'));
        const title = form.get('title');
        document.querySelector('div#editor').click();  // Trigger a click on the editor to transform all canvas to img
        const html = document.querySelector('div#editor').innerHTML;
        const categories = Session.get('selectedCategories');

        Meteor.call('editArticle', {articleId: articleId, title: title, html: html, categories: categories}, function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:"header", headerContent:error.reason, style:"is-danger"});
            } else{
                // Article was edited without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Article modifié avec succès !", style:"is-success"});
                // Sending user to his dashboard
                FlowRouter.go('/dashboard/articles');
            }
        })
    },
    'click a.tag.is-delete'(event){
        event.preventDefault();
        // Link to delete a category tag is cliked
        var selectedCategories = Session.get('selectedCategories');  // Catching the array of categories that are already selected
        // Catching the grand parent element of the delete link (delete link is inside tags div which is inside a control div) :
        var tagToRemove = event.currentTarget.parentElement.parentElement;
        // The catagory to remove is the text content of the tag (control div's first elem is tags div, and it's first elem is the tag) :
        var categoryToRemove = tagToRemove.firstElementChild.firstElementChild.innerText;
        var index = selectedCategories.indexOf(categoryToRemove);  // Catching the index of the category to delete
        selectedCategories.splice(index, 1);  // Removing the category
        Session.set('selectedCategories', selectedCategories);  // Updating the value of the Session variable
        tagToRemove.parentNode.removeChild(tagToRemove);  // Removing the tag
    }
});


Template.editArticle.helpers({
    displayCategories: function(){
        // Display available categories
        Meteor.call('getCategories', function(error, result){
            if(error){
                // There was an error
                Session.set('message', {type:'header', headerContent:error.reason, style:"is-danger"});
            } else{
                // Available categories were successfully retrieved, saving them in a Session variable
                Session.set('articleCategories', result);
            }
        });
        return Session.get('articleCategories');
    },
    displaySelectedCategories: function(){
        return Session.get('selectedCategories');
    },
    displayImage: function(){
        if(Images.findOne({_id: Session.get('currentImageId')}) !== undefined){
            // There is an uploaded image, returning it
            return Images.findOne({_id: Session.get('currentImageId')});
        }
    }
});
