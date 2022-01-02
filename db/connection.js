//import mysql
const mysql = require('mysql2');

//import secure password 
var securePassword = require('secure-password');

// Initialise our password policy
var pwd = securePassword()
 
var userPassword = Buffer.from('MySQLacdr@tt3rr331713!')
 
// Register user
pwd.hash(userPassword, function (err, hash) {
  if (err) throw err
 
  // Save hash somewhere
  pwd.verify(userPassword, hash, function (err, result) {
    if (err) throw err
    
    switch (result) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
        return console.error('This hash was not made with secure-password. Attempt legacy algorithm')
      case securePassword.INVALID:
        return console.log('Invalid password')
      case securePassword.VALID:
        return console.log('Authenticated')
      case securePassword.VALID_NEEDS_REHASH:
        console.log('Yay you made it, wait for us to improve your safety')
 
        pwd.hash(userPassword, function (err, improvedHash) {
          if (err) console.error('You are authenticated, but we could not improve your safety this time around')
 
          // Save improvedHash somewhere
        })
        break
    }
  });
});

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