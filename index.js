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
  const ViewByTitle = "View employees by title";
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
          ViewByTitle,
          AddEmployee,
          AddRole,
          AddDepartment,
          RemoveEmployee,
          RemoveRole,
          RemoveDepartment,
          UpdateEmployeeManager,
          UpdateEmployeeRole,
          ViewAllRoles,
          ViewAllDepartments,
          "EXIT"
        ],
      })
    .then((answer) => {
      const query =
        "SELECT employee.id, employee.firstname, employee.lastname,role.title AS title, departments.department AS department, role.salary AS salary, manager.firstname AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id ORDER BY employee.id";
      connection.query(query, (err, res) => {
        if (err) { throw err; }
        switch (answer.action) {
          case ViewEmployees:
            return showAllEmployees(res);
          case ViewByManager:
            return showEmployeesByManager(res);
          case ViewByDepartment:
            return showEmployeesByDepartment(res);
          case ViewByTitle:
            return showEmployeesByTitle(res);
          case AddEmployee:
            return addEmployee(res);
        }
      })

    })

}

function showAllEmployees(response) {
  console.table(response);
  start()
}

function addEmployee(response) {
  const managerChoices = []
  for (let i = 0; i < response.length; i++) {
    const added = managerChoices.includes(response[i].manager)
    if (response[i].manager === null || added === true) { }
    else {
      managerChoices.push(response[i].manager)
    }
  }
  const titleChoices = []
  for (let i = 0; i < response.length; i++) {
    const added = titleChoices.includes(response[i].title)
    if (response[i].title === null || added === true) { }
    else {
      titleChoices.push(response[i].title)
    }
  }
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstname",
        message: "What is their first name?"
      },
      {
        type: "input",
        name: "lastname",
        message: "What is their last name?"
      },
      {
        type: "rawlist",
        name: "title",
        message: "What is their title?",
        choices: titleChoices
      },
      {
        type: "rawlist",
        name: "manager",
        message: "Who is their manager?",
        choices: managerChoices
      }
    ])
    .then((answer) => {
      const query =
        "SELECT * FROM role";

      connection.query(query, (err, res) => {
        { if (err) { throw err; } }
        const title = res.filter((res) => res.title === answer.title)
        const manager = response.filter((response) => response.firstname === answer.manager)
        console.log(manager)
        const query =
          "INSERT INTO employee SET ?";
        connection.query(query,
          [
            {
              firstname: answer.firstname,
              lastname: answer.lastname,
              role_id: title[0].id,
              manager_id: manager[0].id
            }
          ]
          , (err, res) => {
            if (err) { throw err; }
            console.table(res)
            start();
          })
      })
    })
}

function showEmployeesByManager(response) {
  const choices = []
  for (let i = 0; i < response.length; i++) {
    const added = choices.includes(response[i].manager)
    if (response[i].manager === null || added === true) { }
    else {
      choices.push(response[i].manager)
    }
  }
  inquirer
    .prompt({
      type: "rawlist",
      name: "manager",
      message: "Who is the manager?",
      choices: choices
    })
    .then((answer) => {
      const query =
        "SELECT employee.id, employee.firstname, employee.lastname,role.title AS title, departments.department AS department, role.salary AS salary, manager.firstname AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id WHERE manager.? ORDER BY employee.id";
      connection.query(query,
        [
          {
            firstname: answer.manager
          }
        ]
        , (err, res) => {
          if (err) { throw err; }
          console.table(res)
          start();
        })
    })
}

function showEmployeesByDepartment(response) {
  const choices = []
  for (let i = 0; i < response.length; i++) {
    const added = choices.includes(response[i].department)
    if (response[i].department === null || added === true) { }
    else {
      choices.push(response[i].department)
    }
  }
  inquirer
    .prompt({
      type: "rawlist",
      name: "department",
      message: "What is the department?",
      choices: choices
    })
    .then((answer) => {
      const query =
        "SELECT employee.id, employee.firstname, employee.lastname,role.title AS title, departments.department AS department, role.salary AS salary, manager.firstname AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id WHERE departments.? ORDER BY employee.id";
      connection.query(query,
        [
          {
            department: answer.department
          }
        ]
        , (err, res) => {
          if (err) { throw err; }
          console.table(res)
          start();
        })
    })
}

function showEmployeesByTitle(response) {
  const choices = []
  for (let i = 0; i < response.length; i++) {
    const added = choices.includes(response[i].title)
    if (response[i].title === null || added === true) { }
    else {
      choices.push(response[i].title)
    }
  }
  inquirer
    .prompt({
      type: "rawlist",
      name: "title",
      message: "What is the title?",
      choices: choices
    })
    .then((answer) => {
      const query =
        "SELECT employee.firstname, employee.lastname, manager.firstname AS manager,role.title AS title, departments.department AS department FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id WHERE role.? ORDER BY employee.id;";
      connection.query(query,
        [
          {
            title: answer.title
          }
        ]
        , (err, res) => {
          if (err) { throw err; }
          console.table(res)
          start();
        })
    })
}