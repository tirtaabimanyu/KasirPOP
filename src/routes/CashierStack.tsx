import {
  CashierScreen,
  SummaryScreen,
  PaymentScreen,
} from "../screens/Cashier";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { IconButton, MD3Theme, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { ParamListBase, Route } from "@react-navigation/native";

const Stack = createNativeStackNavigator<CashierStackParamList>();

type HeaderProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string>;
  options: NativeStackNavigationOptions;
  back?: { title: string };
  theme: MD3Theme;
};
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
        contentStyle: styles(theme).card,
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
      flexDirection: "row",
      alignItems: "center",
    },
    headerBackButton: {
      width: "auto",
      height: "auto",
      alignSelf: "center",
      margin: 0,
      marginRight: 16,
    },
  });
