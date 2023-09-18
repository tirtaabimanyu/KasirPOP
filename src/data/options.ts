import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { TransactionModel } from "./entities/TransactionModel";

import { InitDatabase1695040925767 } from "./migrations/1695040925767-init-database";

export const CommonDataSourceOptions = {
  entities: [ProductModel, CategoryModel, TransactionModel],
  migrations: [InitDatabase1695040925767],
};
