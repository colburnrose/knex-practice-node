const ShoppingListService = {
  getAllShoppingItems(db) {
    return db.select("*").from("shopping_list");
  },

  insertShoppingItem(db, item) {
    return db
      .insert(item)
      .into("shopping_list")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ShoppingListService;
