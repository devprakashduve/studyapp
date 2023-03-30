function createUsersTable(db) {
    db.query(
      'CREATE TABLE IF NOT EXISTS users (' +
      'id INT AUTO_INCREMENT PRIMARY KEY, ' +
      'name VARCHAR(255) NOT NULL, ' +
      'email VARCHAR(255) NOT NULL UNIQUE, ' +
      'password VARCHAR(255) NOT NULL, ' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
      ')',
      (error, results, fields) => {
        if (error) {
          console.log('Error creating users table:', error);
        } else {
          console.log('Users table created or already exists!');
        }
      }
    );
    const createSubjectsTable = `CREATE TABLE IF NOT EXISTS subjects (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (id)
      )`;
    
      const createPostsTable = `CREATE TABLE IF NOT EXISTS posts (
        id INT(11) NOT NULL AUTO_INCREMENT,
        subject_id INT(11) NOT NULL,
        title VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      )`;
    
      db.query(createSubjectsTable, (err, result) => {
        if (err) {
          throw err;
        }
        console.log('Subjects table created or already exists');
      });
    
      db.query(createPostsTable, (err, result) => {
        if (err) {
          throw err;
        }
        console.log('Posts table created or already exists');
      });
  }

 

  
  module.exports = { createUsersTable };
  