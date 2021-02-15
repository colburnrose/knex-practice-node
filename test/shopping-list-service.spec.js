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

  describe("getAllShoppingListItems", () => {
    it("returns an empty array", () => {
      return ShoppingListService.getAllShoppingItems(db).then((items) =>
        expect(items).to.eql([])
      );
    });
    // Whenever we set a context with data present, we should always include
    // a beforeEach() hook within the context that takes care of adding the
    // appropriate data to our table
    context(`Data 'shopping_list' has no data`, () => {
      beforeEach("insert test articles", () =>
        db("shopping_list").insert(testItems)
      );

      it(`getAllShoppingItems() resolves all items from 'shopping_list' table`, () => {
        return ShoppingListService.getAllShoppingItems(db).then((actual) => {
          expect(actual).to.eql(
            testItems.map((item) => ({
              ...item,
              date_added: new Date(item.date_added),
            }))
          );
        });
      });
    });
  });

  describe(`insertShoppingList()`, () => {
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
});
