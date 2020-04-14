const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: process.env.PORT || 3306,

  user: "root",

  password: "password",

  database: "employee_db",
});

connection.connect((err) => {
  if (err) { throw err;}

  console.log (connection.threadId)
})