require("dotenv").config();
const knex = require("knex");

const knexDB = knex({
  client: "pg",
  connection: "postgresql://colburnsanders@localhost/knex-practice",
});

// GET: all items that contain text
function searchItemByName(searchTerm) {
  knexDB
    .select("*")
    .from("shopping_list")
    .where("name", "ilike", `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

searchItemByName("Fish tricks");

// GET: list all items paginated
function getItemsPaginated(pageNumber) {
  const itemsPerPage = 10;
  const offset = itemsPerPage * (pageNumber - 1);
  knexDB
    .select("name", "price", "checked", "category")
    .from("shopping_list")
    .limit(itemsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

getItemsPaginated(2);

// GET: all items added after date
function getItemsAfterDateAdded(daysAgo) {
  knexDB
    .select("name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexDB.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then((result) => {
      console.log(result);
    });
}

getItemsAfterDateAdded(5);

// GET: total cost for each category
function getTotalCostByCategory() {
  knexDB
    .select("category")
    .sum("price AS total_price")
    .from("shopping_list")
    .groupBy("category")
    .then((result) => {
      console.log(result);
    });
}

getTotalCostByCategory();
