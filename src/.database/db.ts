import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test_2_user",
    password: "123123123",
    database: "test_2",
    entities: ["./src/.entities/*.ts"],
    logging: true,
    synchronize: true,
})