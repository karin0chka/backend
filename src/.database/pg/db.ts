import { DataSource } from "typeorm";
import OrmEntities from "./orm-entities";
import  config from "../../utils/config";

export const myDataSource = new DataSource({
  type: "postgres",
  host: config.DB.POSTGRES.HOST,
  port: config.DB.POSTGRES.PORT,
  username: config.DB.POSTGRES.USER,
  password: config.DB.POSTGRES.PASSWORD,
  database: config.DB.POSTGRES.DB_NAME,
  entities: OrmEntities,
  logging: false,
  synchronize: false,
});



