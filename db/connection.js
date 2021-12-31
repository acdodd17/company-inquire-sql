const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localHost', 
        user: 'root', 
        password: 'MySQLacdr@tt3rr331713!', 
        database: 'company'
    }, 
    console.log('Connected to the company database')
);

module.exports = db;