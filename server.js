const mysql = require("mysql")
const inquirer = require("inquirer");

//Connect To Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "abmis",
    database: "employee_db"
});

// Example Call to Database
let listOfRoles = [], listOfDepartments = [], listOfEmployees = [];


////////////// Creat all of the lists ////////////////////
function renderLists(callback) {
    console.log("Updating Lists")
    connection.query("SELECT * FROM departments", function (err, result) {
        //console.log(result)
        if (err) {

        }
        for (let i = 0; i < result.length; i++) {
            listOfDepartments.push(result[i].depname);
        }
        console.log(listOfDepartments);


    });
    connection.query("SELECT * FROM employees", function (err, result) {
        //console.log(result)
        if (err) {

        }
        for (let i = 0; i < result.length; i++) {
            listOfEmployees.push(result[i].firstname + result[i].lastname);
        }
        console.log(listOfEmployees);


    });
    connection.query("SELECT * FROM roles", function (err, result) {
        //console.log(result)
        if (err) {

        }
        for (let i = 0; i < result.length; i++) {
            listOfRoles.push(result[i].title);
        }
        console.log(listOfRoles);
    });
    if(typeof callback == "fucntion"){
        callback();
    }
}
renderLists(function(){
    beginProgram();
});

/*
connection.query("SELECT * FROM roles;", function(err, data) {
  if (err) throw err;


  console.log(data)
  connection.end();
});
*/

function databaseAction(input) {
    connection.query(input, function (err, data) {
        if (err) throw err;


        console.log(data)
        connection.end();
    });
}


//Inquirer Code  ==================================
function beginProgram(){
inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Please Select an Action Towards Your Employee Database?',
            choices: [
                'View',
                'Add',
                'Update',
                'Delete',
                'Budget',
            ]
        }

    ])
    .then(answers => {
        console.log(answers.action);

        //////////////////// IF VIEW IS SELECTED ///////////////////////////////
        switch (answers.action) {
            case "View":
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'view_action',
                            message: 'Please Select Which Options You Would Like to View?',
                            choices: [
                                'Department',
                                'Roles',
                                'Employees',
                            ]
                        }

                    ])
                    .then(view_answers => {
                        switch (view_answers.view_action) {
                            case "Departments":
                                databaseAction("SELECT * FROM departments;")
                                break;
                            case "Roles":
                                databaseAction("SELECT * FROM roles;")
                                break;
                            case "Employees":
                                databaseAction("SELECT * FROM employees;")
                                break;
                        }
                    });
                break;
            //////////////////// IF ADD IS SELECTED ///////////////////////////////
            case "Add":
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'add_action',
                            message: 'Please Select Which Options You Would Like to View?',
                            choices: [
                                'Department',
                                'Role',
                                'Employee',
                            ]
                        }

                    ])
                    .then(add_answers => {
                        switch (add_answers.add_action) {
                            case "Department":
                                inquirer
                                    .prompt([
                                        {
                                            type: 'input',
                                            name: 'add_department',
                                            message: 'Please Provide The Department Name: '
                                        }
                                    ])
                                    .then(add_answers => {
                                        connection.query("INSERT INTO departments (depname) VALUES (?)", [add_answers.add_department], function (err, result) {
                                            if (err) {

                                            }
                                            databaseAction("SELECT * FROM departments;")

                                        });
                                    });

                                break;


                            case "Roles":
                                inquirer
                                    .prompt([
                                        {
                                            type: 'input',
                                            name: 'title',
                                            message: 'Please Provide The Department Name: '
                                        },
                                        {
                                            type: 'input',
                                            name: 'salary',
                                            message: 'Please Provide The Department Name: '
                                        },
                                        {
                                            type: 'list',
                                            name: 'department_id',
                                            message: 'Please Provide The Department Name: ',
                                            choices: [

                                            ]
                                        }

                                    ])
                                    .then(add_answers => {
                                        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?);", add_answers, function (err, result) {
                                            if (err) {

                                            }
                                            databaseAction("SELECT * FROM roles;")

                                        });
                                    });
                                break;
                            case "Employees":
                                inquirer
                                    .prompt([
                                        {
                                            type: 'input',
                                            name: 'add_employees',
                                            message: 'Please Provide The Department Name: '
                                        }
                                    ])
                                    .then(add_answers => {
                                        connection.query("INSERT INTO departments (depname) VALUES (?)", add_answers, function (err, result) {
                                            if (err) {

                                            }
                                            databaseAction("SELECT * FROM employees;")

                                        });
                                    });
                                break;
                        }
                    });
                break;

            //////////////////// IF UPDATE IS SELECTED ///////////////////////////////
            case "Update":
                break;

            //////////////////// IF DELETE IS SELECTED ///////////////////////////////
            case "Delete":
                break;

            //////////////////// IF BUDGET IS SELECTED ///////////////////////////////
            case "Budget":
                break;






        }
    });
}
/////////////////////////////// LAYOUT /////////////////////////////////////
//As for all Options
  // add department, roles, employees
  // View department, roles, employees
  // Update Employee Role
  //Update Managers
  //View the total Utilized Budget for entire department
//Delete Departments, Roles, Employees
//View Employees By Manager



// add department, roles, employees
  //add departments
  //add roles
  //add employees


// View department, roles, employees
  //View departments
  //View roles
  //View employees


// Update Employee Role
  //Which Employee
  //New Role


//Extra =========
//Update Managers
  //Which Employee
  //New Manager

//View Employees By Manager
  //Which Manager

//Delete Departments, Roles, Employees

  //Delete departments
  //Delete roles
  //Delete employees

//View the total Utilized Budget for entire department






















