DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE departments (
  id INT AUTO_INCREMENT,
  department VARCHAR(255) NULL,
  PRIMARY KEY (id)
  );
  
INSERT INTO departments (id, department)
VALUES 
(1, "Sales"),
(2, "Operations"),
(3, "Executive");

  CREATE TABLE role (
  id INT AUTO_INCREMENT,
  title VARCHAR(255),
  salary INT,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO role (id, title, salary, department_id)
VALUES 
(1, "Sales Associate", 20000, 1),
(2, "Sales Manager", 40000, 1),
(3, "Operations Manager", 60000, 2),
(4, "CEO", 80000, 3)
;

CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO employee (id, firstname, lastname, role_id, manager_id)
VALUES 
(1, "Anthony", "Boffman", 4, NULL),
(2, "Raymond", "Holt", 3, 1),
(3, "Amy", "Santiago", 2, 1),
(4, "Jake", "Peralta", 1, 3);

SELECT * FROM employee;

SELECT employee.firstname, employee.lastname, manager.firstname AS manager,role.title AS title, departments.department AS department
FROM employee
JOIN role ON employee.role_id = role.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id
JOIN departments ON role.department_id = departments.id
ORDER BY employee.id;




