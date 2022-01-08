const inquirer = require('inquirer');
const db = require('../db/connection');
const start = require('../index');
const { printTable } = require('console-table-printer');

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
                message: 'What is the id of the department to which this role will be added?', 
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
                    console.log('New role successfully added!')
                    viewRoles();
                });
            });
    });
};

//delete roles 
const deleteRole = () => {
    // query to get all roles
    db.query('SELECT * FROM roles', (err, rows) => {
        if (err) throw err; 
        const rolesList = rows.map (role => {
            return {
                name: role.name,
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
                console.log(`${ response.deleteRole } department deleted!`);
                viewRoles();
            })
        });
    });
};

module.exports = { viewRoles, addRole, deleteRole };