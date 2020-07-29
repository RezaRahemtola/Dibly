// Useful imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// HTML import
import './addColumn.html';


FlowRouter.route('/dashboard/design/columns/add', {
    name: 'dashboardDesignColumnsAdd',
    action(){
        // We will render the add column form using Blaze, but we need the user's role to check if access is allowed

        Meteor.call('getCurrentUserRole', function(error, role){
            if(error){
                // TODO: error
                // TODO: send him back to home page (else a blank page is displayed)
            } else if(role === 'designer' || role === 'admin'){
                // User is allowed to access the form, rendering it
                BlazeLayout.render('main', {currentPage: 'addColumn'});
            }
        });
    }
});

Template.addColumn.onRendered(function(){
    // Scrolling the window back to the top
    window.scrollTo(0, 0);


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


Template.addColumn.events({
    'click #submitColumn'(event){
        event.preventDefault();

        // Catching inputs for the call :
        const form = new FormData(document.getElementById('newArticle'));
        const position = form.get('position');
        const html = document.querySelector('div#editor').innerHTML;

        Meteor.call('addMainPageColumn', {position: position, html: html}, function(error, result){
            if(error){
                // TODO: error
            } else{
                // Colum, was added without any error, displaying a success message
                Session.set('message', {type: "header", headerContent: "Colonne ajoutée avec succès !", style:"is-success"});
                // Sending user to columns dashboard
                FlowRouter.go('/dashboard/design/columns');
            }
        })
    }
});
