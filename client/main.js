// Accounts import
import '../imports/config/accounts-config.js';

// JS import
import '../imports/UI/main.js';


// Importing Trumbowyg editor files
import '../node_modules/trumbowyg/dist/ui/trumbowyg.min.css';
import '../node_modules/trumbowyg/dist/trumbowyg.min.js';

// Trumbowyg language file to allow French interface
import '../node_modules/trumbowyg/dist/langs/fr.min.js';

// Trumbowyg plugin which allows to change foreground and background color of your text.
import '../node_modules/trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css';
import '../node_modules/trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js';

// Trumbowyg plugin which allows to resize images (preserving aspect ratio) by dragging their bottom-right corner.
import 'jquery-resizable-dom';  // This plugin depends on the jquery-resizable plugin
import '../node_modules/trumbowyg/dist/plugins/resizimg/trumbowyg.resizimg.min.js';

// Trumbowyg plugin to search and pick gif to insert from Giphy
import '../node_modules/trumbowyg/dist/plugins/giphy/ui/trumbowyg.giphy.min.css';
import '../node_modules/trumbowyg/dist/plugins/giphy/trumbowyg.giphy.min.js';

// Trumbowyg plugin to embed any content from a link using noembed.com API
import '../node_modules/trumbowyg/dist/plugins/noembed/trumbowyg.noembed.min.js';

// Set the Trumbowyg's icons path
$.trumbowyg.svgPath = '/trumbowyg-icons.svg';
