const orm = require("./orm")
const questions = require("./questions")
const inquirer = require("inquirer");


module.exports = {
  // QUESTIONS

  mainMenu: (cb) => {
    inquirer
      .prompt(
        {
          name: "action",
          type: "rawlist",
          message: "What would you like to do?",
          choices: [
            questions.ViewEmployees,
            questions.ViewByManager,
            questions.ViewByDepartment,
            questions.ViewByTitle,
            questions.AddEmployee,
            questions.AddTitle,
            questions.AddDepartment,
            questions.RemoveEmployee,
            questions.RemoveRole,
            questions.RemoveDepartment,
            questions.UpdateEmployeeManager,
            questions.UpdateEmployeeRole,
            questions.ViewAllRoles,
            questions.ViewAllDepartments,
            "EXIT"
          ],
        }).then((answer) => {
          cb(answer)
        })
  },

  viewAll: (cb) => {
    orm.readJoined("employee", (result) => {
      cb(result)
    })
  },

  viewByManager: (cb) => {
    orm.readJoined("employee", (res) => {
      const choices = []
      for (let i = 0; i < res.length; i++) {
        const added = choices.includes(res[i].manager)
        if (res[i].manager === null || added === true) { }
        else {
          choices.push(res[i].manager)
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
          orm.readByCriteria("manager.firstname", answer.manager, (result) => {
            cb(result)
          })

        })
    })
  },

  viewByDepartment: (cb) => {
    orm.readJoined("employee", (res) => {
      const choices = []
  for (let i = 0; i < res.length; i++) {
    const added = choices.includes(res[i].department)
    if (res[i].department === null || added === true) { }
    else {
      choices.push(res[i].department)
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
          orm.readByCriteria("departments.department",answer.department, (result) => {
            cb(result)
          })

        })
    })
  }

}