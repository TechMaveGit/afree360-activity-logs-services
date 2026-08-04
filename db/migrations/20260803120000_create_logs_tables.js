/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  // Create activity_logs
  if (!await knex.schema.hasTable("activity_logs")) {
    await knex.schema.createTable("activity_logs", (table) => {
      table.bigIncrements("id").primary();
      table.bigInteger("user_id").unsigned().notNullable();
      table.string("activity_type", 100).notNullable();
      table.string("service_name", 100).notNullable();
      table.bigInteger("reference_id").unsigned().nullable();
      table.text("description").nullable();
      table.string("ip_address", 45).nullable();
      table.boolean("is_active").defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());

      // Indexes
      table.index(["user_id"]);
      table.index(["activity_type"]);
      table.index(["service_name"]);
      table.index(["reference_id"]);
      table.index(["created_at"]);
    });
  }

  // Create third_party_logs
  if (!await knex.schema.hasTable("third_party_logs")) {
    await knex.schema.createTable("third_party_logs", (table) => {
      table.increments("id").primary();
      table.string("provider_name", 100).notNullable();
      table.text("request_url").nullable();
      table.longtext("request_payload").nullable();
      table.longtext("response_payload").nullable();
      table.integer("status_code").nullable();
      table.text("error_message").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("third_party_logs");
  await knex.schema.dropTableIfExists("activity_logs");
}
