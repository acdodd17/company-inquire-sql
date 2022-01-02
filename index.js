const inquirer = require('inquirer');
const db = require('./db/connection');
const { printTable } = require('console-table-printer');

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

// view all departments
const viewDepartments = () => {
    const sql = `SELECT * FROM departments`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err; 
        }
        printTable(rows);
        start();
    });
};

// view all roles
const viewRoles = () => {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department
                FROM roles
                INNER JOIN departments ON roles.department_id = departments.id`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err; 
        }
        printTable(rows);
        start();
    });
};

// view all employees
const viewEmployees = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name,
                roles.title AS role,
                departments.name AS department,
                roles.salary AS salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                INNER JOIN roles ON e.role_id = roles.id
                LEFT JOIN departments on e.role_id = roles.id AND roles.department_id = departments.id
                LEFT JOIN employees m ON m.id = e.manager_id
    `
    db.query(sql, (err, rows) => {
        if (err) {
            throw err; 
        }
        printTable(rows);
        start();
    });
};

// add a department
const addDepartment = () => {
    inquirer. prompt(
        {
            type: 'input',
            name: 'newDepartment', 
            message: 'What is the name of the department you would like to add?'
        }
    ).then(response => {
        const sql = `INSERT INTO departments (name) VALUES (?)`
        const params = response.newDepartment;

        db.query(sql, params, (err, result) => {
            if (err) {
                throw err; 
            }
            console.log('New department added!')
            viewDepartments();
        });
    });
};

// add a role
const addRole = () => {
    const sql = `INSERT`
    db.query(sql, (err, result) => {
        if (err) {
            throw err; 
        }
        viewRoles();
    });
};

// add an employee
const addEmployee = () => {
    const sql = `
    `
    db.query(sql, (err, result) => {
        if (err) {
            throw err; 
        }
        viewEmployees();
    });
};

// update an employee role
const updateEmployee = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'employeeName', 
            message:'What is the name of the employee you would like to update?'
        }
    )
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`
    db.query(sql, (err, result) => {
        if (err) {
            throw err; 
        }
        viewEmployees();
    });
};