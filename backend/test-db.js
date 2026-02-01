const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '10.10.61.161',
    user: 'disha',
    password: '',
    database: 'student_records',
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('FAILED: Error connecting to MySQL database:', err.message);
        process.exit(1);
    } else {
        console.log('SUCCESS: Connected to MySQL database');
        connection.release();
        process.exit(0);
    }
});
