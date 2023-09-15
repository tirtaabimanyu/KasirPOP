import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { Init1694777113671 } from "./migrations/1694777113671-init";

export const CommonDataSourceOptions = {
  entities: [ProductModel, CategoryModel],
  migrations: [Init1694777113671],
};
