require("dotenv").config();
const knex = require("knex");
const ArticlesService = require("./articles-service/articles-service");

const knexDB = knex({
  client: "pg",
  //   connection: "postgresql://colburnsanders@localhost/knex-practice",
  connection: process.env.TEST_DB_URL,
});

// use all the ArticleService methods
ArticlesService.getAllArticles(knexDB)
  .then((articles) => console.log(articles))
  .then(() =>
    ArticlesService.insertArticle(knexDB, {
      title: "New Title",
      content: "New Content",
      date_published: new Date(),
    })
  )
  .then((newArticle) => {
    console.log(newArticle);
    return ArticlesService.updateArticle(knexDB, newArticle.id, {
      title: "Updated title",
    }).then(() => ArticlesService.getById(knexDB, newArticle.id));
  })
  .then((article) => {
    console.log(article);
    return ArticlesService.deleteArticle(knexDB, article.id);
  });

console.log(ArticlesService.getAllArticles());
