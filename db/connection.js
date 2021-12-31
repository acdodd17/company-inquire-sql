//import mysql
const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localHost', 
        user: 'root', 
        password: 'MySQLacdr@tt3rr331713!', 
        database: 'company'
    }, 
    console.log('Connected to the company database')
);

//export database 
module.exports = db;