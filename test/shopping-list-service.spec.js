const ShoppingListService = require("../src/shopping-list-service/shopping-list-service");
const knex = require("knex");

describe("Shopping List Service Object", () => {
  let db;
  let connection = "postgresql://colburnsanders@localhost/knex-practice";

  // mock data for testing
  const testItems = [
    {
      id: 1,
      name: "First test item!",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      price: "12.00",
      category: "Main",
      checked: false,
    },
    {
      id: 2,
      name: "Second test item!",
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      price: "21.00",
      category: "Snack",
      checked: true,
    },
    {
      id: 3,
      name: "Third test item!",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "3.00",
      category: "Lunch",
      checked: false,
    },
    {
      id: 4,
      name: "Third test item!",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "0.99",
      category: "Breakfast",
      checked: false,
    },
  ];

  // set up db connection in primary scop block
  before("db connection", () => {
    db = knex({
      client: "pg",
      connection: connection,
    });
  });
  // Before all tests run and after each individual test, empty the
  // shopping_list table
  before(() => db("shopping_list").truncate());
  afterEach(() => db("shopping_list").truncate());

  // After all tests run, let go of the db connection
  after("destroy db connection", () => db.destroy());

  describe("getAllShoppingItems()", () => {
    it("returns 'shopping_list' has no data", () => {
      return ShoppingListService.getAllShoppingItems(db).then((items) =>
        expect(items).to.eql([])
      );
    });

    // Whenever we set a context with data present, we should always include
    // a beforeEach() hook within the context that takes care of adding the
    // appropriate data to our table
    context(`with data present`, () => {
      beforeEach("insert shopping items", () =>
        db("shopping_list").insert(testItems)
      );

      it(`returns all test items`, () => {
        return ShoppingListService.getAllShoppingItems(db).then((items) => {
          expect(items).to.eql(testItems);
        });
      });
    });
  });

  describe(`insertShoppingItem()`, () => {
    it("inserts a new shopping item and return item with new id", () => {
      // new shopping item to test
      const item = {
        name: "Test Item",
        price: "6.67",
        date_added: new Date("2020-01-01T00:00:00.000Z"),
        category: "Main",
        checked: false,
      };

      return ShoppingListService.insertShoppingItem(db, item).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          name: item.name,
          price: item.price,
          date_added: item.date_added,
          category: item.category,
          checked: item.checked,
        });
      });
    });
  });

  describe("getItemById()", () => {
    it("should return undefined", () => {
      return ShoppingListService.getItemById(db, 999).then(
        (item) => expect(item).to.be.undefined
      );
    });

    context("with data present", () => {
      before("insert items", () => db("shopping_list").insert(testItems));

      it("should return existing item", () => {
        const expectedShoppingId = 3;
        const expectedShoppingItem = testItems.find(
          (a) => a.id === expectedShoppingId
        );

        return ShoppingListService.getItemById(db, expectedShoppingId).then(
          (actual) => {
            expect(actual).to.eql(expectedShoppingItem);
          }
        );
      });
    });
  });

  describe("deleteShoppingItem()", () => {
    it("should return 0 rows affected", () => {
      return ShoppingListService.deleteItem(db, 999).then((rowsAffected) => {
        expect(rowsAffected).to.eq(0);
      });
    });

    context("with data present", () => {
      before("shopping items", () => db("shopping_list").insert(testItems));
      it("should return 1 row affected and record is removed from db", () => {
        const itemId = 1;
        return ShoppingListService.deleteItem(db, itemId)
          .then(() => ShoppingListService.getAllShoppingItems(db))
          .then((allItems) => {
            const expected = testItems.filter((a) => a.id !== itemId);
            expect(allItems).to.eql(expected);
          });
      });
    });
  });

  describe("updateShoppingItem()", () => {
    it("should return 0 rows affected", () => {
      return ShoppingListService.updateShoppingItem(db, 999, {
        name: "new title!",
      }).then((rowsAffected) => expect(rowsAffected).to.eq(0));
    });

    context("with data present", () => {
      before("insert items", () => db("shopping_list").insert(testItems));

      it("should successfully update an item", () => {
        const itemId = 1;
        const testItem = testItems.find((a) => a.id === itemId);
        // make copy of testArticle in db, overwriting with newly updated field value
        const updatedItem = { ...testItem, name: "New title!" };

        return ShoppingListService.updateShoppingItem(db, itemId, updatedItem)
          .then((rowsAffected) => {
            expect(rowsAffected).to.eq(1);
            return db("shopping_list")
              .select("*")
              .where({ id: itemId })
              .first();
          })
          .then((article) => {
            expect(article).to.eql(updatedItem);
          });
      });
    });
  });
});
