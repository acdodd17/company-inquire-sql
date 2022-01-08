const inquirer = require('inquirer');
const db = require('../db/connection');
const start = require('../index');
const { printTable } = require('console-table-printer');







module.exports = { viewRoles, addRole, deleteRole };