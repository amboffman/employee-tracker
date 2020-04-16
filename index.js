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
        questionmaker.viewAllEmps((result) => {
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
        questionmaker.addTitle((result) => {
          const data = result;
          console.log(data);
          init()
        })
        break;

      case questions.AddDepartment:
        questionmaker.addDepartment((result) => {
          const data = result;
          console.log(data);
          init()
        })
        break;

      case questions.UpdateEmployeeRole:
        questionmaker.updateEmpRole((result) => {
          const data = result;
          console.log(data);
          init()
        })
        break;
        
        case questions.ViewAllRoles:
          questionmaker.viewAllRoles((result) => {
            const data = result;
            console.table(data);
            init()
          })
          break;

        case questions.ViewAllDepartments:
          questionmaker.viewAllDepts((result) => {
            const data = result;
            console.table(data);
            init()
          })
          break;

        default: console.log("Thank you and have a nice day!")
        connection.end()
      }
  })
}
