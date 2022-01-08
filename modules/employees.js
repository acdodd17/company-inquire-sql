const inquirer = require('inquirer');
const db = require('../db/connection');
const start = require('../index');
const { printTable } = require('console-table-printer');

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

// add an employee
const addEmployee = () => {
    // query to get all roles
    db.query('SELECT * FROM roles', (err, rows) => {
        if (err) throw err;
        const roles = rows.map( role => {
            return {
                name: role.title, 
                value: role.id
            }
        })
        // query to get employees with manager_id null for identifying managers later
        db.query('SELECT * FROM employees', (err, rows) => {
            if (err) throw err;
            const managers = rows.filter( employee => employee.manager_id === null);
            const managersList = managers.map(manager => {
                return {
                    name: manager.first_name + ' ' + manager.last_name, 
                    value: manager.id
                }
            })
            // inquirer prompt new employee first_name, last_name, role from all roles, and manager from list of all managers
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName', 
                    message: 'What is the first name of the new employee?'
                }, 
                {
                    type: 'input',
                    name: 'lastName', 
                    message: 'What is the last name of the new employee?'
                }, 
                {
                    type: 'list', 
                    name: 'title',
                    message: 'What new title will this employee hold?',
                    choices: roles
                }, 
                {
                    type: 'list', 
                    name: 'manager', 
                    message: 'Who is the manager of the new employee?', 
                    choices: managersList
                }
            ])
            // query to INSERT into employees : first_name, last_name, role_id, manager_id
            .then(response => {
                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;
                const params = [response.firstName, response.lastName, response.title, response.manager];
                db.query(sql, params, (err, result) => {
                    if (err) throw err; 
                    console.log('New employee added!');
                    viewEmployees();
                })
            });
        });
    });
};

// update an employee role
const updateEmployee = () => {
    db.query('SELECT * FROM roles', (err, rows) => {
        if (err) throw err; 
        const rolesList = rows.map( role => {
            return {
                name:role.title, 
                value: role.id
            }
        })
        db.query('SELECT * FROM employees', (err, rows) => {
            if (err) throw err;
            const employeeList = rows.map (employee => {
                return {
                    name: employee.first_name + ' ' + employee.last_name, 
                    value: employee.id
                }
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee', 
                    message:'What is the name of the employee you would like to update?', 
                    choices: employeeList
                }, 
                {
                    type: 'list', 
                    name: 'newTitle', 
                    message: 'What new title will this employee hold?',
                    choices: rolesList
                }
            ])
            .then(response => {
                const sql = `UPDATE employees SET role_id = ? WHERE id = ?`
                const params = [
                    response.employee, 
                    response.newTitle
                ]
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log ('Employee role updated!')
                })
                viewEmployees();
            })
        }); 
    });
};

// delete employees
const deleteEmployee = () => {
    // query to get all employees
    db.query('SELECT * FROM employees', (err, rows) => {
        if (err) throw err; 
        const employeesList = rows.map (employee => {
            return {
                name: employee.first_name + '' + employee.last_name, 
                value: employee.id
            }
        })
        inquirer.prompt(
            {
                type: 'list', 
                name: 'deleteEmployee', 
                message: 'Which employee would you like to delete?', 
                choices: employeesList
            }
        )
        // query to delete employee
        .then(response => {
            const sql = `DELETE FROM employees WHERE id = ?`;
            const params = [response.deleteEmployee];
            db.query(sql, params, (err, result) => {
                if (err) throw err; 
                console.log('Employee deleted!');
                viewEmployees();
            })
        });
    });
};

module.exports = { viewEmployees, addEmployee, updateEmployee, deleteEmployee };