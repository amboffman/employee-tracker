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

  viewByCategory: (type, cb) => {
    orm.readJoined("employee", (res) => {
      let column = ""
      const choices = []
      for (let i = 0; i < res.length; i++) {
        let colIndex = ""
        switch (type) {
          case "manager":
            colIndex = res[i].manager
            column = "manager.firstname"
            
            break;

          case "department":
            colIndex = res[i].department
            column = "departments.department"
            break;

          case "title":
            colIndex = res[i].title
            column = "role.title"
            break;
          default:
            break;
        }
        const added = choices.includes(colIndex)
        if (colIndex === null || added === true) { }
        else {
          choices.push(colIndex)
        }
      }
      inquirer
        .prompt({
          type: "rawlist",
          name: "choice",
          message: "Which " + type + "?",
          choices: choices
        })
        .then((answer) => {
          console.log(column)
          orm.readByCriteria(column, answer.choice, (result) => {
            cb(result)
          })

        })
    })
  }

}