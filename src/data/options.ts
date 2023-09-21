import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { TransactionModel } from "./entities/TransactionModel";
import { InitDatabase1695274534011 } from "./migrations/1695274534011-init-database";

export const CommonDataSourceOptions = {
  entities: [ProductModel, CategoryModel, TransactionModel],
  migrations: [InitDatabase1695274534011],
};
