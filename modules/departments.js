const inquirer = require('inquirer');
const db = require('../db/connection');
const start = require('../index');
const { printTable } = require('console-table-printer');









//const sql = `SELECT SUM(salary) FROM roles`
module.exports = { viewDepartments, addDepartment, deleteDepartment };