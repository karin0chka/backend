import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  SERVER: { PORT: number };
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
  JWT: { JWT_SECRET: string };
  
}

const config: IConfig = {
  SERVER: { PORT: Number(process.env.PORT) || 3000 },
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
  }
};

export default config;
