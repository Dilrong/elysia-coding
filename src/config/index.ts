import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    jwt: {
      key: process.env.JWT_KEY
    },
    productDB: {
      name: process.env.DB_PRO_NAME,
      user: process.env.DB_PRO_USER,
      password: process.env.DB_PRO_PASSWORD,
      host: process.env.DB_PRO_HOST,
      port: process.env.DB_PRO_PORT
    },
    developmentDB: {
      name: process.env.DB_DEV_NAME,
      user: process.env.DB_DEV_USER,
      password: process.env.DB_DEV_PASSWORD,
      host: process.env.DB_DEV_HOST,
      port: process.env.DB_DEV_PORT
    },
    localDB: {
      storage: process.env.DB_LOCAL_STORAGE,
    }
}