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
            questions.AddDepartment,
            questions.AddTitle,
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
  },

  updateEmpRole: (cb) => {
    orm.readRaw("role", (roleRes) => {
      const titles = roleRes.map((row) => {
        return {
          name: row.title,
          value: row.id,
        };
      });
      orm.readJoined("employee", (res) => {
        const employees = res.map((row) => {
          return {
            name: row.firstname + " " + row.lastname,
            value: row.id,
          };
        });
        inquirer
          .prompt([
            {
              type: "rawlist",
              name: "employee",
              message: "Which employee?",
              choices: employees
            },
            {
              type: "rawlist",
              name: "title",
              message: "What is their new title?",
              choices: titles
            },

          ])
          .then((answer) => {

            const employeeID = JSON.stringify(answer.employee).replace(/['"]+/g, '')

            const roleID = JSON.stringify(answer.title).replace(/['"]+/g, '')

            orm.updateEmpRole(roleID, employeeID, (finalResult) => {
              cb(finalResult)
            })
          })
      })
    })
  },

  addTitle: (cb) => {
    orm.readRaw("departments", (deptRes) => {
      const departments = deptRes.map((row) => {
        return {
          name: row.department,
          value: row.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is new title?"
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
            choices: departments
          }
        ])
        .then((answer) => {

          const title = JSON.stringify(answer.title).replace(/['"]+/g, '')

          const salary = JSON.stringify(answer.salary).replace(/['"]+/g, '')

          const departmentID = JSON.stringify(answer.department).replace(/['"]+/g, '')

          orm.addTitle("title", "salary", "department_id", title, salary, departmentID, (finalResult) => {
            cb(finalResult)
          })
        })
    })
  },

  addDepartment: (cb) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "department",
          message: "What is the name of the department you'd like to add?"
        }
      ])
      .then((answer) => {

        const departmentName = JSON.stringify(answer.department).replace(/['"]+/g, '')

        orm.addDepartment("department", departmentName, (finalResult) => {
          cb(finalResult)
        })
      })
  }



}