require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) {
    console.log('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

module.exports = connection;
