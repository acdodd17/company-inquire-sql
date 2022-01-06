const inquirer = require('inquirer');
const db = require('./db/connection');
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

module.exports = { viewDepartments, addDepartment };