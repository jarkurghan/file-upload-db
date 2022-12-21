// Update with your config settings.
require("dotenv").config({ path: __dirname + "/../.env" });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: "<your_database_credentials>",
    migrations: {
      tableName: "migrations",
    },
  },
  production: {
    client: "pg",
    connection: "<your_database_credentials>",
    migrations: {
      tableName: "migrations",
    },
    seeds: {
      directory: __dirname + "/seeds/production",
    },
  },
};
