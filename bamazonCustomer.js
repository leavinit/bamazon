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

var displayItems = function(){
    connection.query("SELECT * FROM products", function(error, response) {
        console.log("\r\n====================================");
        for (var i = 0; i < response.length; i++) {
          console.log(" |["+response[i].id + " ]|[  " + response[i].product_name + " ]|[ " + response[i].price + " ]| ");
        }
        console.log("====================================\r\n");
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
        message: "ID# of the product to puchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purcase?"
      }
      
    ]).then(function(response){
        console.log ("ID selected: " + response.itemID);
        console.log ("Items to purchase: " + response.quantity);
        checkIfInStock(response.itemID, response.quantity);
    });

}


var checkIfInStock = function(id,amt){
    connection.query("SELECT * FROM products WHERE id =?",[id], 
    function(error, response) {
        // console.log (response);
        console.log(" |["+response[0].id + " ]|[  " + response[0].product_name + " ]|[ " + response[0].price + " ]| ");
        if (response[0].in_stock - amt <= 0){
            console.log("Insufficient Stock. We have only have " +response[0].in_stock+ " remaining.\r\n");
            //since out of stock why not restart and let them try again
            displayItems();
        }
        else {
            console.log ("Purchase complete");
            // code to reduce stock here
        }
    });
}

var updateStock = function(id, amt){
    
}