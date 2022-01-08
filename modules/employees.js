const inquirer = require('inquirer');
const db = require('../db/connection');
const start = require('../index');









module.exports = { viewEmployees, addEmployee, updateEmployee, deleteEmployee };