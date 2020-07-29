// Useful imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing databases
import { Design } from '../../imports/databases/design.js';


Meteor.methods({
    'setBasicDesign'(){
        // Fill the Design collection with basic informations
        if(Design.findOne({name: 'mainPageColumns'}) === undefined){
            // Main page columns design isn't set, insert it in the database
            Design.insert({
                name: 'mainPageColumns',
                value: []  // No column for the moment so we set an empty array
            });
        }
    },
    'getMainPageColumns'(){
        // Catch & return the main page columns array (array of HTML content)
        return Design.findOne({name: 'mainPageColumns'}).value;
    },
    'addMainPageColumn'({position, html}){
        // Type check to prevent malicious calls
        check(position, String);
        check(html, String);

        // TODO: check role (designer admin)

        // Converting the position to integer
        position = parseInt(position);
        // Catching if of columns in the database and the columnsArray
        const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
        var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

        if(isNaN(position)){
            // Position isn't a number, adding the column at the end
            columnsArray.push(html);
        } else{
            // Position is a valid number, adding the column at this position
            columnsArray.splice(position-1, 0, html);  // Position is in natural format, -1 to have an index
        }

        // Updating the database
        Design.update(columnsId, { $set: {
            value: columnsArray
        }});
    },
    'editMainPageColumn'({position, html}){
        // Type check to prevent malicious calls
        check(position, String);
        check(html, String);

        // TODO: check role (designer admin)

        // Converting the position to integer
        position = parseInt(position);
        // Catching if of columns in the database and the columnsArray
        const columnsId = Design.findOne({name: 'mainPageColumns'})._id;
        var columnsArray = Design.findOne({name: 'mainPageColumns'}).value;

        // Checking if the value is a number & a valid index value in the array (position is in natural format, we need to substract 1 to have an index)
        if(!isNaN(position) && columnsArray.hasOwnProperty(position-1)){
            // Position is an integer & the corresponding index exists, we can update the value in the array
            columnsArray[position-1] = html;

            // Updating the database
            Design.update(columnsId, { $set: {
                value: columnsArray
            }});
        }
    }
});
