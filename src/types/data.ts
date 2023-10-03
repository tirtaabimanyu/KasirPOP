// Product

export type ProductData = {
  id: number;
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string | null;
  categoryIds: number[];
};

export type ProductStockData = { isAlwaysInStock: boolean; stock: number };

export type CreateProductData = {
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string | null;
  categoryIds?: number[];
};

export type UpdateProductData = {
  id: number;
  name?: string;
  stock?: number;
  isAlwaysInStock?: boolean;
  price?: number;
  imgUri?: string | null;
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
  tableNumber?: number | null;
};

export type CreateTransactionData = {
  totalPrice: number;
  moneyReceived: number;
  change: number;
  paymentType: PaymentType;
  products: CartItemData[];
  queueNumber: number;
  tableNumber?: number | null;
};

// Settings

export enum PaperSize {
  FIFTY_SEVEN = 57,
  FIFTY_EIGHT = 58,
  EIGHTY = 80,
}

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
  logoImgUri?: string | null;
  address?: string;
  phoneNumber?: string;
};

export type UpdateStoreSettingsData = {
  name?: string;
  logoImgUri?: string | null;
  address?: string;
  phoneNumber?: string;
};

export type PrinterSettingsData = {
  printerName?: string | null;
  printerIdentifier?: string | null;
  printerInterfaceType?: string | null;
  receiptFooter: string;
  footerLink: string;
  footerLinkAsQR: boolean;
  paperSize: number;
  showLogo: boolean;
  showQueueNumber: boolean;
  autoPrintReceipt: boolean;
  autoPrintKitchenReceipt: boolean;
};

export type UpdatePrinterSettingsData = {
  printerName?: string | null;
  printerIdentifier?: string | null;
  printerInterfaceType?: string | null;
  receiptFooter?: string;
  footerLink?: string;
  footerLinkAsQR?: boolean;
  paperSize?: number;
  showLogo?: boolean;
  showQueueNumber?: boolean;
  autoPrintReceipt?: boolean;
  autoPrintKitchenReceipt?: boolean;
};

export type CombinedSettingsData = {
  storeSettings?: StoreSettingsData;
  paymentSettings: PaymentSettingsData;
  printerSettings: PrinterSettingsData;
};

export type UpdateCombinedSettingsData = {
  storeSettings?: UpdateStoreSettingsData;
  paymentSettings?: UpdatePaymentSettingsData;
  printerSettings?: UpdatePrinterSettingsData;
};
