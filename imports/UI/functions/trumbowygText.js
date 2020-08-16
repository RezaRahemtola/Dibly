displayTextEditorOn = function(selector){
    // Display our custom text-only Trumbowyg editor on a given jQuery selector
    $(selector).trumbowyg({
        lang: 'fr',
        autogrow: true,
        urlProtocol: true,
        semantic: {
            'del' : 's'  /* Replace del tags to resolve turning off bug
                            Issue: https://github.com/Alex-D/Trumbowyg/issues/293
                            Docs about semantic: https://alex-d.github.io/Trumbowyg/documentation/#semantic */
        },
        btnsDef: {
            formatage: {
                dropdown: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
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
            ['fontfamily'],
            ['removeformat'],
            ['fullscreen']
        ],
        plugins: {
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
        // When content is changed, add Bulma CSS classes to style the titles
        $('.trumbowyg-editor h1').addClass('title is-1');
        $('.trumbowyg-editor h2').addClass('title is-2');
        $('.trumbowyg-editor h3').addClass('title is-3');
        $('.trumbowyg-editor h4').addClass('title is-4');
        $('.trumbowyg-editor h5').addClass('title is-5');
        $('.trumbowyg-editor h6').addClass('title is-6');
     });
}
