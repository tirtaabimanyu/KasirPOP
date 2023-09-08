import { createStackNavigator } from "@react-navigation/stack";
import {
  CashierScreen,
  SummaryScreen,
  PaymentScreen,
} from "../screens/Cashier";

export type CashierStackParamList = {
  cashier: undefined;
  summary: undefined;
  payment: undefined;
};

const Stack = createStackNavigator<CashierStackParamList>();

const CashierStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="cashier"
        component={CashierScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="summary" component={SummaryScreen} />
      <Stack.Screen name="payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

export default CashierStack;
