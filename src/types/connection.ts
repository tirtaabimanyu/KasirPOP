import { CategoryRepository } from "../data/repositories/CategoryRepository";
import { ProductRepository } from "../data/repositories/ProductRepository";

export type DatabaseConnectionContextData = {
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
};
