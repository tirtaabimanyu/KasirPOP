// Product

import { CategoryModel } from "../data/entities/CategoryModel";

export type ProductData = {
  id: number;
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
  categories?: CategoryData[];
};

export type ProductStockData = { isAlwaysInStock: boolean; stock: number };

export type CreateProductData = {
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
  categories?: CategoryModel[];
};

export type UpdateProductData = CreateProductData & {
  id: number;
};

// Category

export type CategoryData = {
  id: number;
  name: string;
};

export type CreateCategoryData = {
  name: string;
};

// Transaction

export interface CartItemData extends ProductData {
  quantity: number;
}

export type ProductSnapshotData = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type TransactionData = {
  id: number;
  created_at: string;
  total_price: number;
  products: ProductSnapshotData[];
};

export type CreateTransactionData = {
  totalPrice: number;
  products: CartItemData[];
};
