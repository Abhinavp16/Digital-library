const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Your MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'adminDb',
};

async function insertAdmin() {
  const connection = await mysql.createConnection(dbConfig);

  const username = 'mrrobot';
  const plainPassword = '1234'; // Replace with the actual plain password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const [rows] = await connection.execute(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    console.log('Admin inserted successfully');
  } catch (error) {
    console.error('Error inserting admin:', error);
  } finally {
    connection.end();
  }
}

insertAdmin();
