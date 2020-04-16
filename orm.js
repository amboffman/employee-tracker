const connection = require("./connection")

const orm = {

  readRaw: (table, cb) => {
    const query = "SELECT * FROM ??";
    const values = [table]

    connection.query(query, values,
      (err, result) => {
        if (err) { throw err };
        cb(result)
      })
  },

  readJoined: (table, cb) => {
    const query = "SELECT employee.id, employee.firstname, employee.lastname,role.title AS title, departments.department AS department, role.salary AS salary, manager.firstname AS manager FROM ?? JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id ORDER BY employee.id";
    const values = [table]

    connection.query(query, values,
      (err, result) => {
        if (err) { throw err };
        cb(result)
      })
  },

  readByCriteria: (column, value, cb) => {
    const query = "SELECT employee.id, employee.firstname, employee.lastname,role.title AS title, departments.department AS department, role.salary AS salary, manager.firstname AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id JOIN departments ON role.department_id = departments.id WHERE ?? = ? ORDER BY employee.id";
    const values = [column, value]

    connection.query(query, values,
      (err, result) => {
        if (err) { throw err };
        cb(result)
      })
  },

  addEmp: (col1, col2, col3, col4, val1, val2, val3, val4, cb) => {
    const query = "INSERT INTO employee (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
    const values = [col1, col2, col3, col4, val1, val2, val3, val4]

    connection.query(query, values,
      (err, result) => {
        if (err) { throw err };
        cb("Added: " + val1 + " " + val2)
      })
  }

}

module.exports = orm;