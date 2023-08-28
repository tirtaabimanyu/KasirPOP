import { DataSource } from "typeorm";
import { ProductModel } from "./entities/ProductModel";

export const AppDataSource = new DataSource({
  type: "expo",
  database: "db.db",
  driver: require("expo-sqlite"),
  entities: [ProductModel],
  migrations: ["./migrations/"],
  migrationsRun: true,
  synchronize: false,
});
