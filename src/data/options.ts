import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { Init1694754033126 } from "./migrations/1694754033126-init";

export const CommonDataSourceOptions = {
  entities: [ProductModel, CategoryModel],
  migrations: [Init1694754033126],
};
