import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

export const envConfig = {
  SERVER_PORT: process.env.SERVER_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  ADMIN_FULL_NAME: process.env.ADMIN_FULL_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
