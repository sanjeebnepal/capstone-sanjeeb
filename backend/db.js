const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,    
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // ssl: {
  //   ca: fs.readFileSync('./DigiCertGlobalRootCA.crt.pem') 
  // },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then((connection) => {
    console.log('✅ Connected to MySQL Azure database!');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Error connecting to MySQL: ', err);
    return;
  });

module.exports = db;
