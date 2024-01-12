import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  SERVER: { PORT: number; NODE_TYPE: string };
  DB: {
    POSTGRES: {
      HOST: string;
      PORT: number;
      DB_NAME: string;
      USER: string;
      PASSWORD: string;
    };
    MONGO: {
      URI: string;
    };
  };
  JWT: {
    JWT_SECRET: string;
    JWT_EXPIRE_TIME: number;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE_TIME: number;
  };
}

const config: IConfig = {
  SERVER: { PORT: Number(process.env.PORT) || 3000, NODE_TYPE: process.env.NODE_TYPE },
  DB: {
    POSTGRES: {
      HOST: process.env.PG_HOST!,
      PORT: Number(process.env.PG_PORT!),
      DB_NAME: process.env.PG_DB_NAME!,
      USER: process.env.PG_USER!,
      PASSWORD: process.env.PG_PASSWORD!,
    },
    MONGO: {
      URI: process.env.MONGO_DB_URI!,
    },
  },
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRE_TIME: Number(process.env.JWT_EXPIRE_TIME),
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRE_TIME: Number(process.env.JWT_REFRESH_EXPIRE_TIME),
  },
};



export default config;
