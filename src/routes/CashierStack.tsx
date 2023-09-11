import { createStackNavigator } from "@react-navigation/stack";
import {
  CashierScreen,
  SummaryScreen,
  PaymentScreen,
} from "../screens/Cashier";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MD3Theme, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator<CashierStackParamList>();

const CashierStack = (props: DrawerScreenProps<RootDrawerParamList>) => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: styles(theme).card,
      }}
    >
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

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
    },
  });
