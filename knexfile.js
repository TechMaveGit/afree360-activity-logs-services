import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
    },
    migrations: {
      directory: "./db/migrations",
    },
  },
};

export default config;
