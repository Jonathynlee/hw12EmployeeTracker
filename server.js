const mysql = require("mysql")
const inquirer = require("inquirer");
const Table = require('cli-table');
//Connect To Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "abmis",
    database: "employee_db"
});

// Example Call to Database
let listOfRoles = [], listOfDepartments = [], listOfEmployees = [], listOfManagers = [];


////////////// Creat all of the lists ////////////////////
async function renderLists() {

    //console.log("Updating Lists")
    connection.query("SELECT * FROM departments", function (err, result) {
        //console.log(result)
        if (err) {

        }
        for (let i = 0; i < result.length; i++) {
            listOfDepartments.push(result[i].depname);
        }
        //console.log(listOfDepartments);


    });
    connection.query("SELECT * FROM employees", function (err, result) {
        //console.log(result)
        if (err) {

        }
        for (let i = 0; i < result.length; i++) {
            listOfEmployees.push(result[i].firstname + " " + result[i].lastname);

        }
        listOfManagers = listOfEmployees;
        listOfManagers[result.length] = "null";
        //console.log(listOfManagers);


    });
    connection.query("SELECT * FROM roles", function (err, result) {
        //console.log(result)
        if (err) {

        }
        for (let i = 0; i < result.length; i++) {
            listOfRoles.push(result[i].title);
        }
        //console.log(listOfRoles);
    });



}



async function run() {

    await renderLists();
    //await createCompleteTable();
    await beginProgram();

}
run();
/*
connection.query("SELECT * FROM roles;", function(err, data) {
  if (err) throw err;


  console.log(data)
  connection.end();
});
*/
/////////////////////// MODULARIZE DATABASE VIEW ///////////////////////
function databaseAction(input) {
    connection.query(input, function (err, data) {
        if (err) throw err;


        console.log(data)

        connection.end();
    });
}
///////////// Nice Looking Table For Overall Components ///////////////////////
async function createCompleteTable() {


    // instantiate
    const table = new Table({
        head: ['ID', 'First Name', 'Last Name', "Manager", "Role", "Salary", "Department"]
        , colWidths: [10, 20, 20, 20, 20, 20, 20]
    });
    connection.query("SELECT * FROM employees INNER JOIN roles ON employees.role_id = roles.id;", async function (err, data) {
        if (err) throw err;


        //console.log(data)
        function inputt(data) {
            //console.log("making table")
            for (employees in data) {
                if (data[employees].manager_id != null) {
                    table.push(
                        [data[employees].id, data[employees].firstname, data[employees].lastname, listOfManagers[data[employees].manager_id - 1], listOfRoles[data[employees].role_id - 1], data[employees].salary,listOfDepartments[data[employees].department_id - 1] ]

                    );
                } else {
                    table.push(
                        [data[employees].id, data[employees].firstname, data[employees].lastname, "null", listOfRoles[data[employees].role_id - 1], data[employees].salary,listOfDepartments[data[employees].department_id - 1]]

                    );
                }
            }
            console.log(table.toString());
           
        }
        await inputt(data);

    })

    // table is an Array, so you can `push`, `unshift`, `splice` and friends



}
//////////////////////////////////////////////////// Nice Looking Table Departments /////////////////////////////////////////////////
async function createDepartmentTable() {


    // instantiate
    const table = new Table({
        head: ['ID', 'Department']
        , colWidths: [10, 20]
    });
    connection.query("SELECT * FROM departments", async function (err, data) {
        if (err) throw err;


        //console.log(data)
        function inputt(data) {
            //console.log("making table")
            for (department in data) {
                if (data[department].depname != null) {
                    table.push(
                        [data[department].id, data[department].depname]

                    );
                }
            }
            console.log(table.toString());
            
        }
        await inputt(data);

    })

    // table is an Array, so you can `push`, `unshift`, `splice` and friends



}
//////////////////////////////////////////////////////// Nice Looking Roles Departments //////////////////////////////////////////////////////
async function createRolesTable() {


    // instantiate
    const table = new Table({
        head: ['ID', 'Title', 'Salary', "Department"]
        , colWidths: [10, 20, 20, 20]
    });
    connection.query("SELECT * FROM roles", async function (err, data) {
        if (err) throw err;


        //console.log(data)
        function inputt(data) {
            //console.log("making table")
            for (role in data) {
                if (data[role].department_id != null) {
                    table.push(
                        [data[role].id, data[role].title, data[role].salary, listOfDepartments[data[role].department_id - 1]]

                    );
                } else {
                    table.push(
                        [data[role].id, data[role].title, data[role].salary, "null"]

                    );
                }
            }
            console.log(table.toString());
           
        }
        await inputt(data);

    })

    // table is an Array, so you can `push`, `unshift`, `splice` and friends



}





//Inquirer Code  ==================================
function beginProgram() {
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
            //console.log(answers.action);

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
                                case "Department":
                                    createDepartmentTable();
                                    connection.end();
                                    break;
                                case "Roles":
                                    createRolesTable();
                                    connection.end();
                                    break;
                                case "Employees":
                                    createCompleteTable();
                                    connection.end();
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
                                    'Roles',
                                    'Employees',
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
                                                

                                            });
                                        })
                                        .then(()=>{createDepartmentTable();})
                                    break;


                                case "Roles":
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'input',
                                                name: 'title',
                                                message: 'Please Provide The Title of the Role: '
                                            },
                                            {
                                                type: 'number',
                                                name: 'salary',
                                                message: 'Please Provide The Salary for this Job Title: '
                                            },
                                            {
                                                type: 'list',
                                                name: 'department_id',
                                                message: 'Please Provide The Department Name: ',
                                                choices: listOfDepartments


                                            }

                                        ])
                                        .then(add_answers => {
                                            let temp = listOfDepartments.indexOf(add_answers.department_id) + 1;
                                            //console.log(temp)
                                            connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);", [add_answers.title, add_answers.salary, temp], function (err, result) {
                                                if (err) {

                                                }
                                                

                                            });
                                        })
                                        .then(()=>{createRolesTable();})
                                        
                                    break;
                                case "Employees":
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'input',
                                                name: 'firstname',
                                                message: 'Please Provide the Employees First Name: '
                                            }, {
                                                type: 'input',
                                                name: 'lastname',
                                                message: 'Please Provide Employee\'s Last Name: '
                                            }, {
                                                type: 'list',
                                                name: 'manager',
                                                message: 'Please select Employee\'s Manager: ',
                                                choices: listOfManagers
                                            }, {
                                                type: 'list',
                                                name: 'role',
                                                message: 'Please select Employee\'s Role: ',
                                                choices: listOfRoles
                                            }
                                        ])
                                        .then(add_answers => {
                                            if (add_answers.manager != "null") {
                                                connection.query("INSERT INTO employees (firstname, lastname, manager_Id, role_id) VALUES (?,?,?,?);", [add_answers.firstname, add_answers.lastname, listOfEmployees.indexOf(add_answers.manager) + 1, listOfRoles.indexOf(add_answers.role) + 1], function (err, result) {
                                                    if (err) {

                                                    }
                                                    

                                                });
                                            } else {
                                                connection.query("INSERT INTO employees (firstname, lastname, manager_Id, role_id) VALUES (?,?,null,?);", [add_answers.firstname, add_answers.lastname, listOfRoles.indexOf(add_answers.role) + 1], function (err, result) {
                                                    if (err) {
                                                        //console.log(err);
                                                    }
                                                    

                                                });
                                            }
                                        })
                                        .then(()=>{createCompleteTable();})
                                    break;
                            }
                        });
                    
                    break;

                //////////////////// IF UPDATE IS SELECTED ///////////////////////////////
                case "Update":
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employee',
                                message: 'Please Select the Employee you Wish to Update ',
                                choices: listOfEmployees
                            },
                            {
                                type: 'list',
                                name: 'new_role',
                                message: 'Please the Updated Roll',
                                choices: listOfRoles
                            }
                        ])
                        .then(update_answers => {

                            connection.query(" UPDATE employees SET role_id = ? WHERE id = ?;", [listOfRoles.indexOf(update_answers.new_role) + 1, listOfEmployees.indexOf(update_answers.employee) + 1], function (err, result) {
                                if (err) {

                                }
                                

                            });

                        })
                        .then(()=>{createCompleteTable();})
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






















