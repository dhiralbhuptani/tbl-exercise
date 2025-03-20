import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('authors', (table) => {
    table.increments('id').primary();
    table.text('key').unique();
    table.string('name').notNullable();
    table.text('text').nullable();
    table.date('birth_date').nullable();
    table.text('top_subjects').nullable();
    table.text('alternate_names').nullable();
    table.string('top_work').nullable();
    table.string('type').notNullable();
    table.integer('work_count').nullable();
    table.float('ratings_average').nullable();
    table.float('ratings_sortable').nullable();
    table.integer('ratings_count').nullable();
    table.integer('ratings_count_1').nullable();
    table.integer('ratings_count_2').nullable();
    table.integer('ratings_count_3').nullable();
    table.integer('ratings_count_4').nullable();
    table.integer('ratings_count_5').nullable();
    table.integer('want_to_read_count').nullable();
    table.integer('already_read_count').nullable();
    table.integer('currently_reading_count').nullable();
    table.integer('readinglog_count').nullable();
    table.bigint('_version_').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('authors');
}
