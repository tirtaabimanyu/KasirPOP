import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import {
  MD3Theme,
  useTheme,
  IconButton,
  Text,
  MD3LightTheme,
} from "react-native-paper";
import { enableFreeze, enableScreens } from "react-native-screens";
import SummaryScreen from "../screens/SummaryScreen";
import PaymentScreen from "../screens/PaymentScreen";
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { ParamListBase, Route } from "@react-navigation/native";
import HomeDrawer from "./HomeDrawer";
import AddProductScreen from "../screens/AddProductScreen";
import UpdateProductScreen from "../screens/UpdateProductScreen";
import { RootStackParamList } from "../types/routes";
import CategoryScreen from "../screens/CategoryScreen";
import PaymentTypeScreen from "../screens/PaymentTypeScreen";
import StoreSettingsScreen from "../screens/StoreSettingsScreen";
import { useAppSelector } from "../hooks/typedStore";

enableScreens();
enableFreeze();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Text variant="headlineLarge" style={{ flex: 1 }}>
        {options.title}
      </Text>
      {options.headerRight &&
        options.headerRight({ canGoBack: back != undefined })}
    </View>
  );
};

const Router = () => {
  const theme = useTheme();
  const CombinedTheme = {
    ...MD3LightTheme,
    ...DefaultTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...DefaultTheme.colors,
    },
  };
  const { storeSettings } = useAppSelector((state) => state.settings);

  return (
    <NavigationContainer theme={CombinedTheme}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: styles(theme).card,
          header: (props) => <Header {...props} theme={theme} />,
        }}
        initialRouteName={storeSettings == undefined ? "storeSettings" : "home"}
      >
        <Stack.Screen
          name="home"
          component={HomeDrawer}
          options={{ headerShown: false }}
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
        <Stack.Screen
          name="addProduct"
          component={AddProductScreen}
          options={{ title: "Tambah Produk" }}
        />
        <Stack.Screen
          name="updateProduct"
          component={UpdateProductScreen}
          options={{ title: "Ubah Produk" }}
        />
        <Stack.Screen
          name="category"
          component={CategoryScreen}
          options={{ title: "Etalase" }}
        />
        <Stack.Screen
          name="storeSettings"
          component={StoreSettingsScreen}
          options={{ title: "Informasi Toko" }}
        />
        <Stack.Screen
          name="paymentType"
          component={PaymentTypeScreen}
          options={{ title: "Metode Pembayaran" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;

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
      backgroundColor: theme.colors.surface,
      justifyContent: "space-between",
    },
    headerBackButton: {
      width: "auto",
      height: "auto",
      alignSelf: "center",
      margin: 0,
      marginRight: 16,
    },
  });
