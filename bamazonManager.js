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
    deleteProduct()
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

            if (choiceArray[0] === answer.list) {
                viewProducts()
            }
            else if (choiceArray[1] === answer.list) {
                viewLowInventory()
            }
            else if (choiceArray[2] === answer.list) {
                addInventory()
            }
            else {
                addProduct()
            }
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
        connection.end()
    });
}

function viewLowInventory() {
    sqlQuery = "SELECT stock_quantity, product_name FROM products WHERE stock_quantity <= 5"
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end()
    });
}
var productArray = ["Whiskas", "Scratching Post", "Faux Diamond Studded Collar", "Lint Roller", "Zap: Pet stain remover", "Furniture Cover", "'Caturday' logo: Women's t-shirt", "'Space Cat' logo: Men's Hoodie", "Febreeze: Air Freshener", "Dirt Devil: handheld vacuum"]

function addInventory() {
    sqlQuery = "SELECT * FROM products"
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "User Login",
                    type: "input",
                    message: "Enter Username:"
                },
                {
                    name: "password",
                    type: "input",
                    message: "Enter Password:"
                },
                {
                    name: "product_name",
                    type: "list",
                    message: "What is the name of the product?",
                    choices: productArray
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "How many units are you adding to inventory?"
                },
                {
                    name: "confirm",
                    type: "confirm",
                    message: "Are you sure?",
                    default: true
                },
            ])
            .then(function (answer) {
                if (answer.confirm) {
                    var updateProduct = answer.product_name;
                    var updateStock = parseInt(answer.stock_quantity);

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].product_name === updateProduct) {
                            selected = res[i];
                            var updateQuantity = selected.stock_quantity + updateStock;
                        }
                    };
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updateQuantity
                            },
                            {
                                product_name: updateProduct,
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log();
                            console.log(updateQuantity + " units of " + updateStock + " were added to inventory");
                        }
                    );
                }
                else {
                    console.log("You are not authorised to add items!")
                    connection.end()
                }
            });
    });
}

var deptArray = ["Pet Supples", "Housewares", "Clothing"]
function addProduct() {
    inquirer
        .prompt([
            {
                name: "product_name",
                type: "input",
                message: "What is the name of the product?",
            },
            {
                name: "department_name",
                type: "list",
                message: "What department should it belong to?",
                choices: deptArray
            },
            {
                name: "price",
                type: "input",
                message: "How much does this product cost?"
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "How many units are you adding to inventory?"
            },
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function (err) {
                    if (err) throw err; 
                    var newItem = answer.stock_quantity + " units of " + answer.product_name + " at " + answer.price + " were added to the " + answer.department_name + ' department.'
                    console.log()
                    console.log(newItem);
                    connection.end()
                }
            );
        });
}




