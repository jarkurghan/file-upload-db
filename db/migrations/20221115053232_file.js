/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("files", function (table) {
      table.uuid("file_uuid").primary();
      table.string("name").notNullable();
      table.string("type").notNullable();
      table.timestamp("created_date").defaultTo(knex.fn.now());
    })
    .createTable("file_chunk", function (table) {
      table.increments("id");
      table.uuid("file_uuid").notNullable();
      table.binary("chunk");
      table.foreign("file_uuid").references("file_uuid").inTable("files");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("file_chunk").dropTable("files");
};
