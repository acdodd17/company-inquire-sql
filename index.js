const inquirer = require('inquirer');
const db = require('./db/connection');
const { viewDepartments, addDepartment } = require('./src/departments');
const { viewRoles, addRole} = require('./src/roles');
const { viewEmployees, addEmployee, updateEmployee} = require('./src/employees');

// connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    start();
})

// start application with offering menu options: [view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role]
const start = () => {
    inquirer.prompt(
        {
            type: 'list', 
            name: 'menu', 
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
    ). then(response => {
        if (response.menu === 'view all departments') {
            viewDepartments();
        } else if (response.menu === 'view all roles') {
            viewRoles();
        } else if (response.menu === 'view all employees') {
            viewEmployees();
        } else if (response.menu === 'add a department') {
            addDepartment();
        } else if (response.menu === 'add a role') {
            addRole();
        } else if (response.menu === 'add an employee') {
            addEmployee();
        } else if (response.menu === 'update an employee role') {
            updateEmployee();
        }
    });
};








