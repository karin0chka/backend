import dotenv from "dotenv";

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
  };
}

 const config: IConfig = {
    SERVER: { PORT: Number(process.env.PORT) || 3000 },
  DB: {
    POSTGRES: {
      HOST:process.env.PG_HOST!,
      PORT:Number(process.env.PG_PORT!),
      DB_NAME:process.env.PG_DB_NAME!,
      USER:process.env.PG_USER!,
      PASSWORD:process.env.PG_PASSWORD!
    }
  }
};


export default config