import { ProductData, TransactionData } from "./data";

export type RootStackParamList = {
  home?: { screen?: keyof HomeDrawerParamList };
  summary: undefined;
  payment: undefined;
  paymentSuccess: { transactionData: TransactionData };
  addProduct: undefined;
  updateProduct: { productData: ProductData };
  category: undefined;
  storeSettings: undefined;
  paymentType: undefined;
  printerSettings: undefined;
  landing: undefined;
  initialSetup: undefined;
  tutorial: undefined;
};

export type HomeDrawerParamList = {
  cashier: undefined;
  inventory: undefined;
  transactions: undefined;
  settings: undefined;
};
