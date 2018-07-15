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
    // load items for sale
    itemsForSale()
    //prompt customer purchase

});

function itemsForSale() {
    sqlQuery = "SELECT * FROM products"
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.log("Items for sale");

        var resultArray = res.map(obj => {
            var onSale = {};
            onSale.item_id = obj.item_id;
            onSale.product_name = obj.product_name;
            onSale.price = obj.price;
            return onSale;
        });
        console.table(resultArray)

        inquirer
            .prompt([
                {
                    name: "item_id",
                    type: "input",
                    message: "What is the item ID of the product you'd like?"
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "How many units would you like?"
                },
            ])
            .then(function (answer) {
                var chosenID = parseInt(answer.item_id)
                var quantity = parseInt(answer.stock_quantity)
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === chosenID) {
                        selected = res[i];
                    }
                };

                if (selected.stock_quantity >= quantity) {
                    var updateQuantity = selected.stock_quantity - quantity;
                    console.log(updateQuantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updateQuantity
                            },
                            {
                                item_id: chosenID
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            var cost = selected.price * quantity;
                            cost_d = cost.toFixed(2);
                            console.log("Your total is $ " + cost_d)
                        }
                    );
                }
                else {
                    console.log("Insufficient quantity!")
                }
                connection.end();
            });
    })
}
