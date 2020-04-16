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
  },

  addEmployee: (cb) => {
    orm.readRaw("role", (roleRes) => {
      const titles = roleRes.map((row) => {
        return {
          name: row.title,
          value: row.id,
        };
      });
      orm.readJoined("employee", (res) => {
        const managers = []
        for (let i = 0; i < res.length; i++) {
          const added = managers.includes(res[i].manager)
          if (res[i].manager === null || added === true) { }
          else {
            managers.push(res[i].manager)
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
              choices: titles
            },
            {
              type: "rawlist",
              name: "manager",
              message: "Who is their manager?",
              choices: managers
            }
          ])
          .then((answer) => {
            const manager = res.filter((response) => response.firstname === answer.manager)

            const firstname = JSON.stringify(answer.firstname).replace(/['"]+/g, '')

            const lastname = JSON.stringify(answer.lastname).replace(/['"]+/g, '')

            const roleID = JSON.stringify(answer.title).replace(/['"]+/g, '')

            const managerID = JSON.stringify(manager[0].id).replace(/['"]+/g, '')

            orm.addEmp("firstname", "lastname", "role_id", "manager_id", firstname, lastname, roleID, managerID, (finalResult) => {
              cb(finalResult)
            })
          })
      })
    })
  }

}