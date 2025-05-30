import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client, Pool } from 'pg';
import { envConfig } from 'src/constants/env.constant';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: Number(envConfig.DB_PORT),
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  extra: {
    connectionLimit: 10,
  },
};

export const createDatabaseIfNotExists = async () => {
  try {
    const client = new Client({
      host: envConfig.DB_HOST,
      port: Number(envConfig.DB_PORT),
      user: envConfig.DB_USERNAME,
      password: envConfig.DB_PASSWORD,
    });
    await client.connect();
    const dbName = envConfig.DB_NAME;

    // check if the database already exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (res.rowCount === 0) {
      // create the database if it doesn't exist
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

// Function to set sequence start values to 101 for all entities with auto-generated primary keys
export const setInitialSequenceValues = async () => {
  const pool = new Pool({
    host: envConfig.DB_HOST,
    user: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
  });

  try {
    // Query to get only sequences linked to primary key columns
    const { rows: sequences } = await pool.query(`
        SELECT pg_get_serial_sequence(table_name, column_name) AS sequence_name
        FROM information_schema.columns
        WHERE column_default LIKE 'nextval%' AND table_schema = 'public';
      `);

    for (const row of sequences) {
      const sequenceName = row.sequence_name;
      if (sequenceName) {
        try {
          // Check current value of the sequence
          const { rows: currentValRows } = await pool.query(
            `SELECT last_value FROM ${sequenceName}`,
          );
          const currentVal = currentValRows[0].last_value;

          // Only reset the sequence if the current value is exactly 1
          if (currentVal < 100) {
            await pool.query(`ALTER SEQUENCE ${sequenceName} RESTART WITH 101`);
            console.log(`Sequence ${sequenceName} set to start from 101.`);
          } else {
            console.log(
              `Sequence ${sequenceName} current value (${currentVal}) is not 1. Skipping reset.`,
            );
          }
        } catch (error) {
          console.error(
            `Failed to check/set sequence for ${sequenceName}:`,
            error,
          );
        }
      }
    }
  } catch (error) {
    console.error('Error fetching sequences:', error);
  } finally {
    await pool.end();
  }
};
