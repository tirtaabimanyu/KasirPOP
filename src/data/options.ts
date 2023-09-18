import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { TransactionModel } from "./entities/TransactionModel";

import { Init1694777113671 } from "./migrations/1694777113671-init";
import { AddTransactions1695021475234 } from "./migrations/1695021475234-add-transactions";

export const CommonDataSourceOptions = {
  entities: [ProductModel, CategoryModel, TransactionModel],
  migrations: [Init1694777113671, AddTransactions1695021475234],
};
