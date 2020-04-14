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
  if (err) { throw err; }

  console.log("Connection established at: " + connection.threadId);

  start();
})

function start() {
  const ViewEmployees = "View all employees";
  const ViewByDepartment = "View employees by department";
  const ViewByRole = "View employees by role";
  const ViewByManager = "View employees by manager";
  const AddEmployee = "Add employee";
  const RemoveEmployee = "Remove employee";
  const UpdateEmployeeRole = "Update employee role";
  const UpdateEmployeeManager = "Update employee manager";
  const ViewAllRoles = "View all roles";
  const AddRole = "Add role";
  const RemoveRole = "Remove role";
  const ViewAllDepartments = "View all departments";
  const AddDepartment = "Add department";
  const RemoveDepartment = "Remove department";

  inquirer
    .prompt(
      {
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          ViewEmployees,
          ViewByManager,
          ViewByDepartment,
          ViewByRole,
          AddEmployee,
          RemoveEmployee,
          UpdateEmployeeManager,
          UpdateEmployeeRole,
          ViewAllRoles,
          AddRole,
          RemoveRole,
          ViewAllDepartments,
          AddDepartment,
          RemoveDepartment,
          "EXIT"
        ],
      })
    .then((answer) => {
      switch (answer.action) {
        case ViewEmployees:
          return showAllEmployees();

      }

    })

}

function showAllEmployees() {
  const query =
    "SELECT employee.id, employee.firstname, employee.lastname,role.title AS title, departments.department AS department, role.salary AS salary, manager.firstname AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id;";
  connection.query(query, (err, res) => {
    if (err) { throw err; }
    for (let i = 0; i < res.length; i++) {
      console.log(
        "ID: " +
        res[i].id +
        " || First Name: " +
        res[i].firstname +
        " || Last Name: " +
        res[i].lastname +
        " || Title: " +
        res[i].title +
        " || Department: " +
        res[i].department + 
        " || Salary: " +
        res[i].salary +
        " || Manager: " +
        res[i].manager + 
        "\n"
      )
    }
    start();
  })
}