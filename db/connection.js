//import mysql
const mysql = require('mysql2');

require('dotenv').config();

//connect to database
const db = mysql.createConnection(
    {
        host: 'localHost', 
        user: 'root', 
        password: process.env.DB_PW, 
        database: 'company'
    }, 
    console.log('Connected to the company database')
);

//export database 
module.exports = db;