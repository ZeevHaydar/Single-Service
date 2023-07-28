const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nazhifhaidar',        // Ganti dengan username MySQL Anda
  password: '123Haidar!', // Ganti dengan password MySQL Anda
  database: 'singleservice'  // Ganti dengan nama database yang telah dibuat sebelumnya
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;
