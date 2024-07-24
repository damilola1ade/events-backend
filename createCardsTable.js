const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createEventsTable = `CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  provider VARCHAR ( 50 ) NOT NULL,
  cardNumber BIGINT UNIQUE NOT NULL,
  cardName VARCHAR ( 50 ) NOT NULL,
  expiryDate VARCHAR ( 10 ) NOT NULL,
  cvv INTEGER NOT NULL,
  user_id VARCHAR ( 225 ) NOT NULL
  );`;

const alterCardsTable = `
 ALTER TABLE cards 
  DROP CONSTRAINT IF EXISTS cards_provider_key;
`;

pool
  .query(alterCardsTable)
  .then((response) => {
    console.log("Table EDITED");
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = pool;
