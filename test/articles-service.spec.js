const ArticlesService = require("../src/articles-service/articles-service");
const knex = require("knex");

describe(`Articles Service Object`, function () {
  let connection = "postgresql://colburnsanders@localhost/knex-practice-test";
  let db;
  // Mock data that represents valid content for the DB.
  let articles = [
    {
      id: 1,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      title: "First test post",
      content: "first test post content",
    },
    {
      id: 2,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      title: "Second test post",
      content: "second test post content",
    },
    {
      id: 3,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      title: "Third test post",
      content: "third test post content",
    },
  ];

  before("setup db", () => {
    db = knex({
      client: "pg",
      connection: connection,
    });
  });
  // remove data from the table before insert and after each test
  before("clean db", () => db("blogful_articles").truncate());
  afterEach("clean db", () => db("blogful_articles").truncate());
  // Returns a PROMISE before callback function
  // will wait for the SQL INSERT to complete.

  // after all tests run, let go of the db connection
  after(() => db.destroy());

  context("Given 'blogful_artciles' has data", () => {
    before(() => {
      return db.into("blogful_articles").insert(articles);
    });

    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
      //test that ArticlesService.getAllArticles gets data from table
      return ArticlesService.getAllArticles(db).then((actual) => {
        expect(actual).to.eql(articles);
      });
    });
  });

  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAllArticles() resolves an empty array`, () => {
      return ArticlesService.getAllArticles(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
  });
});
