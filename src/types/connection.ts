import { CategoryRepository } from "../data/repositories/CategoryRepository";
import { ProductRepository } from "../data/repositories/ProductRepository";
import { TransactionRepository } from "../data/repositories/TransactionRepository";

export type DatabaseConnectionContextData = {
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  transactionRepository: TransactionRepository;
};
