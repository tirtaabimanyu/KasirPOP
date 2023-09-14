import { DataSource } from "typeorm";

import { ProductModel } from "./entities/ProductModel";
import { Migrations1692982176634 } from "./migrations/1692982176634-create_products_table";

export const AppDataSource = new DataSource({
  type: "expo",
  database: "default.db",
  driver: require("expo-sqlite"),
  entities: [ProductModel],
  migrations: [Migrations1692982176634],
  migrationsRun: true,
  synchronize: false,
});
