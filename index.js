const inquirer = require("inquirer");
const connection = require("./connection")
const questionmaker = require("./question-maker")
const questions = require("./questions")
const orm = require("./orm")

init();

function init(){
  questionmaker.mainMenu((results) => {
    const choice = results.action;
 
    switch (choice) {

      case questions.ViewEmployees:
        questionmaker.viewAll((result) => {
          const data = result;
          console.table(data);
          init()
        })
        break;

      case questions.ViewByManager:
        questionmaker.viewByCategory("manager",(result) => {
          const data = result;
          console.table(data);
          init()
        })
        break;


        case questions.ViewByDepartment:
          questionmaker.viewByCategory("department",(result) => {
            const data = result;
            console.table(data);
            init()
          })
          break;

          case questions.ViewByTitle:
            questionmaker.viewByCategory("title",(result) => {
              const data = result;
              console.table(data);
              init()
            })
            break;

      case questions.AddEmployee:
        questionmaker.addEmployee((result) => {
          const data = result;
          console.log(data);
          init()
        })
        break;

      case questions.AddTitle:
        return addTitle(res);
        default: console.log("try again")
      }
  })
}


function start() {
  inquirer
    .prompt(
      {
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          questionmaker.ViewEmployees,
          questionmaker.ViewByManager,
          questionmaker.ViewByDepartment,
          questionmaker.ViewByTitle,
          questionmaker.AddEmployee,
          questionmaker.AddTitle,
          questionmaker.AddDepartment,
          questionmaker.RemoveEmployee,
          questionmaker.RemoveRole,
          questionmaker.RemoveDepartment,
          questionmaker.UpdateEmployeeManager,
          questionmaker.UpdateEmployeeRole,
          questionmaker.ViewAllRoles,
          questionmaker.ViewAllDepartments,
          "EXIT"
        ],
      })
    .then((answer) => {
        switch (answer.action) {
          case questionmaker.ViewEmployees:
            questionmaker.viewAll((result) => {
              console.table(result)
              start()
            })
            break;

          case ViewByManager:
            return showEmployeesByManager(res);
            
          case ViewByDepartment:
            return showEmployeesByDepartment(res);
          case ViewByTitle:
            return showEmployeesByTitle(res);
          case AddEmployee:
            return addEmployee(res);
          case AddTitle:
            return addTitle(res);
        }

    })

}

function showAllEmployees(response) {
  console.table(response);
  start()
}

function addEmployeeOLD(response) {
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
            start();
          })
      })
    })
}

function addTitle(response) {
  const query =
    "SELECT * FROM departments";
  connection.query(query, (err, results) => {
    if (err) { throw err; }
    const choices = []
    for (let i = 0; i < response.length; i++) {
      const added = choices.includes(response[i].department)
      if (response[i].department === null || added === true) { }
      else {
        choices.push(response[i].department)
      }
    }

    const query =
      "SELECT * FROM role";
    connection.query(query, (err, res) => {
      if (err) { throw err; }

      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the title?"
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary?"
          },
          {
            type: "rawlist",
            name: "department",
            message: "Which department?",
            choices: choices
          }
        ])
        .then((answer) => {
          const department = results.filter((result) => result.department === answer.department)
          const match = res.filter((res) => res.title === answer.title)
          if (match.length > 0) {
            console.log("This title is already in our database. Please add another.")
            addTitle()
          }
          else {
            const query =
              "INSERT INTO role SET ?";
            connection.query(query,
              [
                {
                  title: answer.title,
                  salary: answer.salary,
                  department_id: department[0].id
                }
              ]
              , (err, responses) => {
                if (err) { throw err; }
                start();
              })
          }
        })
    })
  })
}