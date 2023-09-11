import {
  StackHeaderProps,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  CashierScreen,
  SummaryScreen,
  PaymentScreen,
} from "../screens/Cashier";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { IconButton, MD3Theme, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

const Stack = createStackNavigator<CashierStackParamList>();

interface HeaderProps extends StackHeaderProps {
  theme: MD3Theme;
}
const Header = ({ theme, options, navigation, back }: HeaderProps) => {
  return (
    <View style={styles(theme).header}>
      {back && (
        <IconButton
          icon="arrow-left"
          size={24}
          style={styles(theme).headerBackButton}
          onPress={navigation.goBack}
        />
      )}
      <Text variant="headlineLarge">{options.title}</Text>
    </View>
  );
};

const CashierStack = (props: DrawerScreenProps<RootDrawerParamList>) => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: styles(theme).card,
        header: (props) => <Header {...props} theme={theme} />,
      }}
    >
      <Stack.Screen
        name="cashier"
        component={CashierScreen}
        options={{ title: "Kasir" }}
      />
      <Stack.Screen
        name="summary"
        component={SummaryScreen}
        options={{ title: "Ringkasan Pesanan" }}
      />
      <Stack.Screen
        name="payment"
        component={PaymentScreen}
        options={{ title: "Pembayaran" }}
      />
    </Stack.Navigator>
  );
};

export default CashierStack;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
    },
    header: {
      paddingHorizontal: 32,
      paddingVertical: 16,
    },
    headerBackButton: {
      width: "auto",
      height: "auto",
      alignItems: "flex-start",
      margin: 0,
      marginBottom: 24,
    },
  });
