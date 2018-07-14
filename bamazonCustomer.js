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
    // console.log("connected as id " + connection.threadId + "\n");
    itemsForSale()
});

function itemsForSale() {
    sqlQuery = "SELECT item_id, product_name, price FROM products"
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        // for (var i = 0; i < res.length; i++) {
        // console.log( res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: $" + res[i].price) 

        // console.log("-----------------------------------------------------------------");
        console.log();
        console.log("Items for sale");
        console.log();
        // console.table(res);

        let cols = [];
        for (let i in res[0]) {
            cols.push(i);
        };

        console.log(cols.join(" | "));
        console.log("------------------------")
        res.forEach(row => {
            let rowValues = [];
            cols.forEach(col => {
                rowValues.push(row[col]);
            });
            connection.end();
            console.log(rowValues.join(' | '));
            });
        });
    }
