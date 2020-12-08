require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: ""
});
connection.connect((err) => {
    if (err)
      throw err;
    console.log("Local host connected as id:" + connection.threadId);
    start();
  });

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Role",
                    "Add Department",
                    "Add Role",
                    "Add Employee",
                    "Update Employee Role"
                ]
            }
        ]).then((val) => {
            switch (val.choice) {
              case "View All Employees":
                viewAllEmployees();
                break;

              case "View All Employees By Department":
                console.log("test2");
                viewAllDepartments();
                break;

              case "View All Employees By Role":
                viewAllRoles();
                break;

              case "Add Department":
                addDepartment();
                break;

              case "Add Role":
                addRole();
                break;

              case "Add Employee":
                addEmployee();
                break;

              case "Update Employee Role":
                updateEmployeeRole();
                break;
            }
          });
};

function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.role_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id;",
         (err, res) => {
        if (err)
          throw err;
        console.table(res);
        start();
      });
};

function viewAllDepartments() {
    console.log("test");
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id ORDER BY employee.id;",
        (err, res) => {

        if (err)
          throw err;
        console.table(res);
        console.log(res);
        start();
      });
};

function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, roles.title AS Title FROM employee JOIN roles ON employee.role_id = roles.id;",
        (err, res) => {
        if (err)
          throw err;
        console.table(res);
        start();
      });
};

function addDepartment() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then((res) => {
        var query = connection.query(
          "INSERT INTO department SET ? ",
          {
            name: res.name
          },
          (err) => {
            if (err)
              throw err;
            console.table(res);
            start();
          });
      });
};

function addRole() {
    connection.query("SELECT * FROM department",
        (err, res) => {
        if (err)
          throw err;
        var choices = res.map(department => department.name);
        inquirer.prompt(
          [
            {
              name: "title",
              type: "input",
              message: "What is the employee's job title?"
            },
            {
              name: "salary",
              type: "input",
              message: "What is the employee's salary"
            },
            {
              name: "department",
              type: "list",
              message: "What department will they be in?",
              choices: choices
            }
          ]

        ).then((answers) => {
          var findDept = res.find(department => department.name === answers.department);
          connection.query("INSERT INTO roles SET ?",
            {
              title: answers.title,
              salary: answers.salary,
              department_id: findDept.id
            },

            function (err) {
              if (err)
                throw err;
              start();
            });
        });
      });
};

var roleArr = [];

function selectRole() {
  connection.query("SELECT * FROM roles", (err, res) => {
      if (err)
        throw err;
      for (var i = 0; i < res.length; i++) {
        roleArr.push(res[i].title);
      }

    })
  return roleArr;
}

var managersArr = [];

function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", (err, res) => {
      if (err)
        throw err;
      for (var i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name);
      }

    })
  return managersArr;
}

function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is role? ",
          choices: selectRole()
        },
        {
            name: "manager",
            type: "rawlist",
            message: "Whats managers name?",
            choices: selectManager()
        }
    ]).then((answers) => {
        var roleId = selectRole().indexOf(answers.role) + 1;
        var managerId = selectManager().indexOf(answers.manager) + 1;
        connection.query("INSERT INTO employee SET ?",
          {
            first_name: answers.firstname,
            last_name: answers.lastname,
            manager_id: managerId,
            role_id: roleId
          }, (err) => {
            if (err)
              throw err;
            console.table(answers);
            start();
          });

      })
}

function updateEmployeeRole() {
    connection.query("SELECT employee.last_name, roles.title FROM employee JOIN roles ON employee.role_id = roles.id;", function(err, res) {
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: () => {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then((res) => {
          var roleId = selectRole().indexOf(res.role) + 1;
          connection.query("UPDATE employee SET WHERE ?",
            {
              last_name: res.lastName
            },
            {
              role_id: roleId
            },
            function (err) {
              if (err)
                throw err;
              console.table(res);
              start();
            });

        });
  });

  }