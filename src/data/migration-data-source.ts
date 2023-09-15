import { DataSource } from "typeorm";
import { CommonDataSourceOptions } from "./options";

export const AppDataSource = new DataSource({
  ...CommonDataSourceOptions,
  type: "sqlite",
  database: "src/data/migrations/migration-database.sqlite",
});
