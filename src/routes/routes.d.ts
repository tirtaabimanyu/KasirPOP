type RootDrawerParamList = {
  "cashier-stack": undefined;
  inventory: undefined;
  transactions: undefined;
  settings: undefined;
};

type drawerItem = {
  label: string;
  icon: IconSource;
  route: keyof RootDrawerParamList;
  component: any;
};

type CashierStackParamList = {
  cashier: undefined;
  summary: undefined;
  payment: undefined;
};
