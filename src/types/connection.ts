import { CategoryService } from "../data/services/CategoryService";
import { ProductService } from "../data/services/ProductService";
import { SettingsService } from "../data/services/SettingsService";
import { TransactionService } from "../data/services/TransactionService";

export type DatabaseConnectionContextData = {
  productService: ProductService;
  categoryService: CategoryService;
  transactionService: TransactionService;
  settingsService: SettingsService;
};
