import * as dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

const KnexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.PG_DB_HOST,
    port: Number(process.env.PG_DB_PORT),
    user: process.env.PG_DB_USER,
    password: process.env.PG_DB_PASSWORD,
    database: process.env.PG_DB_DATABASE,
  },
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default KnexConfig;
