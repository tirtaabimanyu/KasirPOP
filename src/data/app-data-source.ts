import { DataSource } from "typeorm";
import { CommonDataSourceOptions } from "./options";

export const AppDataSource = new DataSource({
  ...CommonDataSourceOptions,
  type: "expo",
  database: "default.db",
  driver: require("expo-sqlite"),
  migrationsRun: true,
  synchronize: false,
});
