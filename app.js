const express = require('express');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const  pool  = require('./db');
const  createTable  = require('./create-tables');

// create an Express app
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use the bodyParser middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create a MySQL pool pool
createTable.createUsersTable(pool)



// define your routes here
app.get('/', (req, res) => {
    res.render('home');
  });
  
  app.get('/login', (req, res) => {
    res.render('login',{message:'',error:''});
  });
  
  app.get('/auth/create-subject', (req, res) => {
    res.render('forms/add-subject',{message:'',error:''});
  });

  app.post('/subjects', (req, res) => {
    const {subjectName } = req.body;
    const sql = `INSERT INTO subjects (name) VALUES ('${subjectName}')`;
    pool.query(sql, (error, results) => {
      if (error) {
        console.error(error);
        // return res.status(500).json({ message: error.sqlMessage });
        res.render('forms/add-subject', { message:'', error: error.sqlMessage });
      }

      // return res.status(201).json({ message: 'Subject registered successfully' });
      res.render('forms/add-subject', { message: 'Subject registered successfully',error:'' });
    });
  });
  

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const sql = `SELECT * FROM users WHERE email='${email}'`;
  
    pool.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
  
      if (result.length === 0) {
        return res.status(401).send('Invalid email or password');
      }
  
      const user = result[0];
  
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          throw err;
        }
  
        if (!match) {
          return res.status(401).send('Invalid email or password');
        }
  
        res.send(`Welcome ${user.name}!`);
      });
    });
  });

  
  app.get('/register', (req, res) => {
    res.render('register',{message:'',error:''});
  });

 app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
  if(password != confirmPassword){
    res.render("register",{ message: '',error:'Confirm password is not equal to password' })
  }
    // Check if user with given email already exists in the database
    const checkUserExistsQuery = 'SELECT * FROM users WHERE email = ?';
    pool.query(checkUserExistsQuery, [email], (error, results) => {
      if (error) {
        console.error(error);
        // return res.status(500).json({ message: 'Internal server error3' });
        res.render("register",{ message: '',error:'Internal server error' })
      }
  
      if (results.length > 0) {
        // return res.status(409).json({ message: 'User with given email already exists' });
        res.render("register",{ message: '',error:'User with given email already exists' })
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          throw err;
        }
      // If user doesn't exist, insert new user into database
      const sql = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hash}')`;
      pool.query(sql, (error, results) => {
        if (error) {
          console.error(error);
          // return res.status(500).json({ message: 'Internal server error' });
          res.render("register",{ message: '',error:'Internal server error' })
        }

        res.render("register",{ message: 'User registered successfully',error:'' })
  
        // return res.status(201).json({ message: 'User registered successfully' });
      });
    });
});
  });

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
