import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      database: process.env.DATABASE_NAME || process.env.DB_NAME,
      user: process.env.DB_USER_NAME || process.env.DB_USER,
      password: process.env.DB_USER_PASSWORD || process.env.DB_PASSWORD,
    },
    migrations: {
      directory: "./db/migrations",
    },
  },
};

export default config;
