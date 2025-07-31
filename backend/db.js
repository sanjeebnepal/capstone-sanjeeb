const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
  .then(() => console.log('✅ Connected to Azure SQL Database!'))
  .catch(err => console.error('❌ Error connecting to Azure SQL:', err));

module.exports = {
  query: async (query, params = []) => {
    await poolConnect;
    const request = pool.request();
    params.forEach((param, i) => {
      request.input(`param${i}`, param);
    });
    const result = await request.query(query);
    return result.recordset;
  }
};
