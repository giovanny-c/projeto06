import "reflect-metadata"
import { DataSource } from "typeorm"

import "dotenv/config"

export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: "database",

    port: +(process.env.DB_PORT as string),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,

    entities: [
        "./src/modules/**/entities/*.ts"
    ],
    migrations: [
        "./src/database/migrations/*.ts"
    ],
})

dataSource.initialize()