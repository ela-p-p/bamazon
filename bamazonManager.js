var mySql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

var connection = mySql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "Isolde2018!",
    database: "bamazonDB"
});

var sqlQuery = "";

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected")
    menuOptions()
});
var choiceArray = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
function menuOptions() {
    inquirer
        .prompt([
            {
                name: "list",
                type: "list",
                message: "What would you like to do?",
                choices: choiceArray
            }
        ])
        .then(function (answer) {
            console.log(answer)
            
            if (choiceArray[0] === answer.list) {
                   viewProducts()
            }
            else if (choiceArray[1] === answer.list) {
                viewLowInventory()
            }
            else if (choiceArray[2] === answer.list) {
                addInventory()
             }
            // else {
            //     addProduct()
            // }
        
        });
}

function viewProducts() {
    sqlQuery = "SELECT * FROM products"
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.log("Items for sale");
        var resultArray = res.map(obj => {
            var table = {};
            table.item_id = obj.item_id;
            table.product_name = obj.product_name;
            table.price = obj.price;
            table.stock_quantity = obj.stock_quantity
            return table;
        });
        console.table(resultArray)
    });
}

function viewLowInventory() {
    sqlQuery = "SELECT stock_quantity, product_name FROM products WHERE stock_quantity <= 5"
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
}

function addInventory() {
    
}

