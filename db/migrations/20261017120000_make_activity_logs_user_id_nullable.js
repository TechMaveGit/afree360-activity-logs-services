/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  const hasTable = await knex.schema.hasTable("activity_logs");
  if (hasTable) {
    await knex.raw("ALTER TABLE activity_logs MODIFY COLUMN user_id BIGINT UNSIGNED NULL DEFAULT NULL");
  }
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  const hasTable = await knex.schema.hasTable("activity_logs");
  if (hasTable) {
    await knex.raw("ALTER TABLE activity_logs MODIFY COLUMN user_id BIGINT UNSIGNED NOT NULL");
  }
}
