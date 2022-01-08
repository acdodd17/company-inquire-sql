const inquirer = require('inquirer');
const db = require('../db/connection');
const start = require('../index');
const { printTable } = require('console-table-printer');

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
                console.log(`${ response.deleteDepartment } department deleted!`);
                viewDepartments();
            })
        });
    });
};

// view total utilized budget of a department 
const viewBudget = () => {

};

//const sql = `SELECT SUM(salary) FROM roles`
module.exports = { viewDepartments, addDepartment, deleteDepartment };