import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationContainerProps,
} from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { Drawer as PDrawer } from "react-native-paper";
import CashierStack from "./CashierStack";
import InventoryScreen from "../screens/InventoryScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const drawerItems: drawerItem[] = [
  {
    label: "Kasir",
    icon: "account-outline",
    route: "cashier-stack",
    component: CashierStack,
  },
  {
    label: "Inventori",
    icon: "tune",
    route: "inventory",
    component: InventoryScreen,
  },
  {
    label: "Riwayat Transaksi",
    icon: "bookmark-outline",
    route: "transactions",
    component: TransactionsScreen,
  },
  {
    label: "Pengaturan",
    icon: "cog",
    route: "settings",
    component: SettingsScreen,
  },
];

const DrawerContent = ({ state, navigation }: DrawerContentComponentProps) => {
  return (
    <View style={styles.drawerContent}>
      <PDrawer.Section style={styles.drawerSection} showDivider={false}>
        {drawerItems.map((item, idx) => {
          return (
            <PDrawer.CollapsedItem
              key={"drawerItem-" + item.route}
              focusedIcon={item.icon}
              label={item.label}
              onPress={() => {
                navigation.navigate(item.route);
              }}
              active={state.index == idx}
            />
          );
        })}
      </PDrawer.Section>
    </View>
  );
};

const Router = (props: NavigationContainerProps) => {
  return (
    <NavigationContainer {...props}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: "permanent",
          drawerStyle: { width: "auto" },
        }}
        drawerContent={(drawerContentProps) => (
          <DrawerContent {...drawerContentProps} />
        )}
      >
        {drawerItems.map((item) => {
          return (
            <Drawer.Screen
              name={item.route}
              component={item.component}
              key={"DrawerScreen-" + item.route}
            />
          );
        })}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Router;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 44,
  },
  drawerSection: {
    marginTop: 15,
  },
});
