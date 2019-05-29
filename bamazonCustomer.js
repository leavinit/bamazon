var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    
    console.log("connected to database");

    //first display all of the items available for sale
    displayItems();

    
  });

var totalItems;  //var to hold number of items for validation later
var displayItems = function(){
    connection.query("SELECT * FROM products", function(error, response) {
        console.log("\r\n================================================================");
        totalItems = response.length;
        for (var i = 0; i < response.length; i++) {
          console.log(" |[     "+response[i].id + "\t]|[  " + response[i].product_name + " \t\t]|[ " + response[i].price + "\t]| ");
        }
        console.log("================================================================\r\n");
        //items displayed, now ask user which item and how many to buy

        queryUser();
    });
}


var queryUser = function(){
    //The app should then prompt users with two messages.
    inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: "ID# of the product to purchase?",
        validate: function(id){
          
          if (id < 1 || id > totalItems || isNaN(id)){
            return "Enter a valid id#.";
          }
          return true;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function(quantity){
          if (quantity < 1 || isNaN(quantity)){
            return "Enter a valid quantity.";
          }
          return true;
        }
      }
    ]).then(function(response){
        console.log('\033c'); //clears terminal
        console.log ("ID selected: " + response.itemID);
        console.log ("Items to purchase: " + response.quantity);
        checkIfInStock(response.itemID, response.quantity);
    });

}


var checkIfDone = function(){
  //Check if the user wants to make another purchase
  inquirer
  .prompt([
    {
      name: "logout",
      type: "input",
      message: "Would you like to make another purchase [Y/N]?"
    }]).then(function(response){
      if (response.logout.toUpperCase() == "N"){
        console.log("Thanks for shopping, have a nice day!");
        process.exit() ;
      }
      if (response.logout.toUpperCase() == "Y"){
        //redraw the menu
        displayItems();
      }
      
  });
  
}


//utility function for rounding price to two decimals (found on stackoverflow)
//  https://stackoverflow.com/a/18358056

function roundToTwo(num) {    
  return (+(Math.round(num + "e+2")  + "e-2")).toFixed(2);
}


var checkIfInStock = function(id,amt){
    connection.query("SELECT * FROM products WHERE id =?",[id], 
    function(error, response) {
        // console.log (response);
        console.log(" |["+response[0].id + " ]|[  " + response[0].product_name + " ]|[ " + response[0].price + " ]| ");
        if (response[0].in_stock - amt < 0){
            console.log('\033c'); //clears terminal
            console.log("Insufficient Stock. We have only have " +response[0].in_stock+ " remaining.\r\n");
            //since out of stock, see if the user wants to either logout or make another purchase
            checkIfDone();
        }
        else {
            var totalCost = amt * response[0].price;
            console.log ("Total cost for this purchase: $" + roundToTwo(totalCost));
            console.log ("Purchase complete");
            console.log ("There are "+ (response[0].in_stock - amt)+ " units of "+ response[0].product_name + " remaining.")
            // code to reduce stock here: update function takes new stock amt, not the amt to be removed
            updateStock(response[0].id,response[0].in_stock-amt);

          }
    });
}

var updateStock = function(id, amt){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            in_stock: amt
          },
          {
            id: id
          }
        ],
        function(error) {
          if (error) throw error;
          console.log("Stock updated..");
          checkIfDone();
        }
      );

}