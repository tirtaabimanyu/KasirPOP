type RootStackParamList = {
  home?: { screen?: keyof HomeDrawerParamList };
  summary: undefined;
  payment: undefined;
  addProduct: undefined;
};

type HomeDrawerParamList = {
  cashier: undefined;
  inventory: undefined;
  transactions: undefined;
  settings: undefined;
};
