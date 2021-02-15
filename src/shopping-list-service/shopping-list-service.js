const ShoppingListService = {
  getAllShoppingItems(knex) {
    return knex.select("*").from("shopping_list");
  },

  insertShoppingItem(knex, item) {
    return knex
      .insert(item)
      .into("shopping_list")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getItemById(knex, id) {
    return knex("shopping_list").select("*").where({ id }).first();
  },

  deleteItem(knex, id) {
    return knex("shopping_list").where({ id }).delete();
  },

  updateShoppingItem(knex, id, data) {
    return knex("shopping_list").where({ id }).update(data);
  },
};

module.exports = ShoppingListService;
