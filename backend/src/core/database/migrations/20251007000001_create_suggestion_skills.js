/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasTable = await knex.schema.hasTable('suggestion_skills');
    if (!hasTable) {
        return knex.schema.createTable('suggestion_skills', function (table) {
            table.increments('id').primary();
            table.integer('candidate_id').references('id').inTable('candidates').onDelete('CASCADE');
            table.text('categories').notNullable();
            table.text('level').notNullable();
            table.specificType('keywords', 'TEXT[]').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('suggestion_skills');
};