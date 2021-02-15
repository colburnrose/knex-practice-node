require("dotenv").config();
const knex = require("knex");
const ArticlesService = require("./articles-service/articles-service");

const knexDB = knex({
  client: "pg",
  //   connection: "postgresql://colburnsanders@localhost/knex-practice",
  connection: process.env.TEST_DB_URL,
});

console.log(ArticlesService.getAllArticles());
