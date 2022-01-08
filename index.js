//import modules
const inquirer = require('inquirer');
const db = require('./db/connection');
const { printTable } = require('console-table-printer');
// const departments = require('./departments');
// const roles = require('./roles');
// const employees = require('./employees');

// connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    start();
})

// start application with offering menu options: [view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role]
start = function() {
    inquirer.prompt(
        {
            type: 'list', 
            name: 'menu', 
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 
            'add a department', 'add a role', 'add an employee', 'update an employee role', 
            'delete department','delete role','delete employee']
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
        } else if (response.menu === 'delete department') {
            deleteDepartment();
        } else if (response.menu === 'delete role') {
            deleteRole();
        } else if (response.menu === 'delete employee') {
            deleteEmployee();
        }
    });
};

// ------------------------ VIEW DATA ------------------------ 
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

// view total utilized budget of a department 
const viewBudget = () => {

};

// ------------------------ ADD DATA ------------------------ 
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
    db.query('SELECT * FROM departments', (err, rows) => {
        if (err) throw err; 
        const departmentList = rows.map (department => {
            return {
                name: department.name, 
                value: department.id
            }
        })
        inquirer.prompt([
            {
                type: 'input',
                name: 'title', 
                message: 'What is the name of the new role you would like to add?'
            }, 
            {
                type: 'input', 
                name: 'salary', 
                message: 'What is the salary for this new role?'
            },
            {
                type: 'list',
                name: 'department_id', 
                message: 'To which department will this role will be added?', 
                choices: departmentList
            }])
            .then(response => {
                const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`
                const params = [
                    response.title, 
                    response.salary, 
                    response.department_id
                ];
                db.query(sql, params, (err, result) => {
                    if (err) {
                        throw err; 
                    }
                    console.log('New role added!')
                    viewRoles();
                });
            });
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
            //new manager -> null (no manager)
            const nullManager = {
                name: 'null', 
                value: null
            };
            const managers = rows.filter( employee => employee.manager_id === null);
            const managersList = managers.map(manager => {
                return {
                    name: manager.first_name + ' ' + manager.last_name, 
                    value: manager.id
                }
            })
            // add option for no manager
            managersList.push(nullManager);
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
                    choices: managersList,
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

// ------------------------ DELETE DATA ------------------------ 
// delete department 
const deleteDepartment = () => {
    // query to get all departments
    db.query('SELECT * FROM departments', (err, rows) => {
        if (err) throw err; 
        const departmentsList = rows.map (department => {
            return {
                name: department.name,
                value: department.id
            }
        })
        inquirer.prompt(
            {
                type: 'list', 
                name: 'deleteDepartment', 
                message: 'Which department would you like to delete?', 
                choices: departmentsList
            }
        )
        // query to delete department
        .then(response => {
            const sql = `DELETE FROM departments WHERE id = ?`;
            const params = [response.deleteDepartment];
            db.query(sql, params, (err, result) => {
                if (err) throw err; 
                console.log(`Department deleted!`);
                viewDepartments();
            })
        });
    });
};

//delete role
const deleteRole = () => {
    // query to get all roles
    db.query('SELECT * FROM roles', (err, rows) => {
        if (err) throw err; 
        const rolesList = rows.map (role => {
            return {
                name: role.title,
                value: role.id
            }
        })
        inquirer.prompt(
            {
                type: 'list', 
                name: 'deleteRole', 
                message: 'Which role would you like to delete?', 
                choices: rolesList
            }
        )
        // query to delete role
        .then(response => {
            const sql = `DELETE FROM roles WHERE id = ?`;
            const params = [response.deleteRole];
            db.query(sql, params, (err, result) => {
                if (err) throw err; 
                console.log(`Role deleted!`);
                viewRoles();
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
                name: employee.first_name + ' ' + employee.last_name, 
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

// ------------------------ UPDATE EXISTING DATA ------------------------ 
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
                    response.newTitle, 
                    response.employee
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

// update manager 
const updateManager = () => {

};
