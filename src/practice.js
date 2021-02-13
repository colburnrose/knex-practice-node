require("dotenv").config();
const knex = require("knex");

const knexDB = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

console.log("knex and driver installed successfully", knexDB);
