const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db');

// Display the login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle the login form submission
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  connection.query(sql, [email], (error, results) => {
    if (error) {
      console.log('Error querying users:', error);
      res.redirect('/auth/login');
    } else if (results.length === 0) {
      console.log('User not found');
      res.redirect('/auth/login');
    } else {
      const user = results[0];
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          console.log('Error comparing passwords:', error);
          res.redirect('/auth/login');
        } else if (result === true) {
          req.session.userId = user.id;
          res.redirect('/dashboard');
        } else {
          console.log('Password incorrect');
          res.redirect('/auth/login');
        }
      });
    }
  });
});

// Display the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle the registration form submission
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      console.log('Error hashing password:', error);
      res.redirect('/auth/register');
    } else {
      connection.query(sql, [name, email, hash], (error, result) => {
        if (error) {
          console.log('Error inserting user:', error);
          res.redirect('/auth/register');
        } else {
          console.log('User created');
          res.redirect('/auth/login');
        }
      });
    }
  });
});

module.exports = router;
