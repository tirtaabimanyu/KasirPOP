import { DataSource } from "typeorm";

import { ProductModel } from "./entities/ProductModel";
import { Migrations1692982176634 } from "./migrations/1692982176634-create_products_table";
import { Migrations1693208647429 } from "./migrations/1693208647429-add_imageUrl_column_to_products";

export const AppDataSource = new DataSource({
  type: "expo",
  database: "db.db",
  driver: require("expo-sqlite"),
  entities: [ProductModel],
  migrations: [Migrations1692982176634, Migrations1693208647429],
  migrationsRun: true,
  synchronize: false,
});
