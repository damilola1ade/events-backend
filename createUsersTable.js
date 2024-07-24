const { Pool } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createUsersTable = `CREATE TABLE users (
id serial PRIMARY KEY,
name VARCHAR ( 255 ) NOT NULL,
email VARCHAR ( 255 ) UNIQUE NOT NULL,
password VARCHAR ( 255 ) NOT NULL
);`;

pool
  .query(createUsersTable)
  .then((response) => {
    console.log("Table created");
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = pool;
