// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML imports
import './addArticle.html';


FlowRouter.route('/dashboard/articles/add', {
    name: 'dashboardAddArticle',
    action(){
        // We will render the add article template using Blaze, checking if user is allowed to add an article

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'admin' || role === 'author'){
                // User can add an article
                BlazeLayout.render('main', {currentPage: 'addArticle'});
            }
        });
    }
});


Template.addArticle.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);

    // Dynamically check and show selected categories
    Session.set('selectedCategories', []);  // // Creating an array to store the categories and saving it in a Session variable to allow removing from events
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


    $('div#editor').trumbowyg({
        lang: 'fr',
        autogrow: true,
        urlProtocol: true,
        semantic: {
            'del' : 's'  /* Replace del tags to resolve turning off bug
                            Issue: https://github.com/Alex-D/Trumbowyg/issues/293
                            Docs about semantic: https://alex-d.github.io/Trumbowyg/documentation/#semantic */
        },
        defaultLinkTarget: '_blank',
        btnsDef: {
            columns: {
                fn: function(){
                    document.querySelector('div#editor').innerHTML += `
                    <br>
                    <div class='columns'>
                        <div class='column' style="text-align: center;">Colonne 1</div>
                        <div class='column' style="text-align: center;">Colonne 2</div>
                    </div>
                    <p>Après les colonnes</p>`;
                },
                title: 'Insérer des colonnes',
                text: 'Colonnes',
                isSupported: function () { return true; },
                hasIcon: false
            },
            align: {
                dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                title: 'Alignement',
                ico: 'justifyLeft'
            },
            formatage: {
                dropdown: ['p', 'blockquote', 'h3', 'h4', 'h5', 'h6'],
                title: 'Formatage',
                ico: 'p'
            }
        },
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatage'],
            ['strong', 'em', 'del'],
            ['foreColor', 'backColor'],
            // ['superscript', 'subscript'],
            ['fontfamily'],
            ['link'],
            ['insertImage'],
            ['giphy'],
            ['noembed'],
            ['align'],
            ['removeformat'],
            //['horizontalRule'],
            ['unorderedList', 'orderedList'],
            ['columns'],
            ['fullscreen']

        ],
        plugins: {
            giphy: {
                apiKey: Session.get('giphyApiKey')
            },
            fontfamily: {
                fontList: [
                    {name: 'Arial Black', family: 'Arial Black, Gadget, sans-serif'},
                    {name: 'Changa One', family: 'Changa One, Helvetica, sans-serif'},
                    {name: 'Comic Sans', family: 'Comic Sans MS, Textile, cursive, sans-serif'},
                    {name: 'Courier New', family: 'Courier New, Courier, monospace'},
                    {name: 'Impact', family: 'Impact, Charcoal, sans-serif'},
                    {name: 'Lucida Console', family: 'Lucida Console, Monaco, monospace'},
                    {name: 'Parisienne', family: 'Parisienne, sans-serif'},
                    {name: 'Times New Roman', family: 'Times New Roman, Times, serif'}
                ]
            }
        }
    })
    .on('tbwchange', function(){
        // When the content is changed, add Bulma CSS classes to style the elements

        // Titles
        $('.trumbowyg-editor h3').addClass('title is-3');
        $('.trumbowyg-editor h4').addClass('title is-4');
        $('.trumbowyg-editor h5').addClass('title is-5');
        $('.trumbowyg-editor h6').addClass('title is-6');
     });
});


Template.addArticle.events({
    'click #submitArticle'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.getElementById('newArticle'));
        const title = form.get('title');
        const html = document.querySelector('div#editor').innerHTML;
        const categories = Session.get('selectedCategories');

        Meteor.call('addArticle', {title: title, html: html, categories: categories}, function(error, result){
            if(error){
                // TODO: error
            } else{
                // Article was added without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Article publié avec succès !", style:"is-success"});
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


Template.addArticle.helpers({
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
    }
});
