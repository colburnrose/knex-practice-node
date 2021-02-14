require("dotenv").config();
const knex = require("knex");

const knexDB = knex({
  client: "pg",
  connection: "postgresql://colburnsanders@localhost/knex-practice",
});

console.log("knex and driver installed successfully", knexDB);

// knexDB
//   .from("amazing_products")
//   .select("*")
//   .then((result) => {
//     console.log(result);
//   });

// SELECT product_id, name, price, category
// FROM amazong_products
// WHERE name = 'Point of view gun';

const query = knexDB
  .select("product_id", "name", "price", "category")
  .from("amazing_products")
  .where({ name: "Point of view gun" })
  .first()
  .then((result) => {
    console.log(result);
  });
console.log(query);

function searchByProduceName(searchTerm) {
  knexDB
    .select("product_id", "name", "price", "category")
    .from("amazing_products")
    .where("name", "ilike", `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

searchByProduceName("holo");

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);

  knexDB
    .select("product_id", "name", "price", "category")
    .from("amazing_products")
    .limit(productsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

paginateProducts(2);

function getProductsWithImage() {
  knexDB
    .select("product_id", "name", "price", "category")
    .from("amazing_products")
    .whereNotNull("image")
    .then((result) => {
      console.log(result);
    });
}

getProductsWithImage();

function findMostPopularVideo(days) {
  knexDB
    .select("video_name", "region")
    .count("date_viewed AS views")
    .where("date_viewed", ">", knexDB.raw(`now() -' ?? days'::INTERVAL`, days))
    .from("whopipe_video_views")
    .groupBy("video_name", "region")
    .orderBy([
      {
        column: "region",
        order: "ASC",
        column: "views",
        order: "DESC",
      },
    ])
    .then((result) => {
      console.log(result);
    });
}

findMostPopularVideo(30);
