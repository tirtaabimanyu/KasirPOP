import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { TransactionModel } from "./entities/TransactionModel";
import { InitDatabase1695021758387 } from "./migrations/1695021758387-init-database";

export const CommonDataSourceOptions = {
  entities: [ProductModel, CategoryModel, TransactionModel],
  migrations: [InitDatabase1695021758387],
};
