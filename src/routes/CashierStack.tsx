import { createStackNavigator } from "@react-navigation/stack";
import {
  CashierScreen,
  SummaryScreen,
  PaymentScreen,
} from "../screens/Cashier";
import { DrawerScreenProps } from "@react-navigation/drawer";

const Stack = createStackNavigator<CashierStackParamList>();

const CashierStack = (props: DrawerScreenProps<RootDrawerParamList>) => {
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
