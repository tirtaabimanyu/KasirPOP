import { DataSource } from "typeorm";

import { ProductModel } from "./entities/ProductModel";
import { ProductCategoryModel } from "./entities/ProductCategoryModel";
import { Migrations1692982176634 } from "./migrations/1692982176634-create_products_table";
import { Migrations1694693160593 } from "./migrations/1694693160593-create_product_categories_table";

export const AppDataSource = new DataSource({
  type: "expo",
  database: "default.db",
  driver: require("expo-sqlite"),
  entities: [ProductModel, ProductCategoryModel],
  migrations: [Migrations1692982176634, Migrations1694693160593],
  migrationsRun: true,
  synchronize: false,
});
