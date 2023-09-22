import { ProductData } from "./data";

export type RootStackParamList = {
  home?: { screen?: keyof HomeDrawerParamList };
  summary: undefined;
  payment: undefined;
  addProduct: undefined;
  updateProduct: { productData: ProductData };
  category: undefined;
  storeSettings: undefined;
  paymentType: undefined;
};

export type HomeDrawerParamList = {
  cashier: undefined;
  inventory: undefined;
  transactions: undefined;
  settings: undefined;
};
