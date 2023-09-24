// Product

export type ProductData = {
  id: number;
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
  categoryIds: number[];
};

export type ProductStockData = { isAlwaysInStock: boolean; stock: number };

export type CreateProductData = {
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
  categoryIds?: number[];
};

export type UpdateProductData = {
  id: number;
  name?: string;
  stock?: number;
  isAlwaysInStock?: boolean;
  price?: number;
  imgUri?: string;
  categoryIds?: number[];
};

// Category

export type CategoryData = {
  id: number;
  name: string;
  displayOrder: number;
};

export type CreateCategoryData = {
  name: string;
  displayOrder: number;
};

export type UpdateCategoryData = {
  id: number;
  name?: string;
  displayOrder?: number;
};

// Transaction

export enum PaymentType {
  CASH = "cash",
  QRIS = "qris",
}

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
  createdAt: string;
  totalPrice: number;
  moneyReceived: number;
  change: number;
  paymentType: PaymentType;
  products: ProductSnapshotData[];
  queueNumber: number;
};

export type CreateTransactionData = {
  totalPrice: number;
  moneyReceived: number;
  change: number;
  paymentType: PaymentType;
  products: CartItemData[];
  queueNumber: number;
};

// Settings

export type PaymentSettingsData = {
  cash: boolean;
  qris: boolean;
  qrisImgUri?: string;
};

export type UpdatePaymentSettingsData = {
  cash?: boolean;
  qris?: boolean;
  qrisImgUri?: string;
};

export type StoreSettingsData = {
  name: string;
  logoImgUri?: string;
  address?: string;
  phoneNumber?: string;
};

export type CombinedSettingsData = {
  storeSettings?: StoreSettingsData;
  paymentSettings: PaymentSettingsData;
};

export type UpdateCombinedSettingsData = {
  storeSettings?: StoreSettingsData;
  paymentSettings?: UpdatePaymentSettingsData;
};
