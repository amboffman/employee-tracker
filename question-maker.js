// QUESTIONS
module.exports = {
  showAllEmployees: function (response) {
  console.table(response);
},
showEmployeesByManager: function (response) {
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


}