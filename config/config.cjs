require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'dernekuser',
    password: process.env.DB_PASSWORD || 'dernekpass',
    database: process.env.DB_NAME || 'dernek_erp_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.DB_USER || 'dernekuser',
    password: process.env.DB_PASSWORD || 'dernekpass',
    database: process.env.DB_NAME || 'dernek_erp_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
