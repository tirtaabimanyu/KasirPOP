import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import { MD3Theme, Drawer as PDrawer, useTheme } from "react-native-paper";
import InventoryScreen from "../screens/Home/InventoryScreen";
import TransactionsScreen from "../screens/Home/TransactionsScreen";
import SettingsScreen from "../screens/Home/SettingsScreen";
import CashierScreen from "../screens/Home/CashierScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

const Drawer = createDrawerNavigator<HomeDrawerParamList>();

type DrawerItem = {
  label: string;
  icon: IconSource;
  route: keyof HomeDrawerParamList;
  component: any;
};

const drawerItems: DrawerItem[] = [
  {
    label: "Kasir",
    icon: "cash-register",
    route: "cashier",
    component: CashierScreen,
  },
  {
    label: "Inventori",
    icon: "store",
    route: "inventory",
    component: InventoryScreen,
  },
  {
    label: "Riwayat Transaksi",
    icon: "history",
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
  const theme = useTheme();

  return (
    <View style={styles(theme).drawerContent}>
      <PDrawer.Section style={styles(theme).drawerSection} showDivider={false}>
        {drawerItems.map((item, idx) => {
          return (
            <PDrawer.CollapsedItem
              key={"drawerItem-" + item.route}
              focusedIcon={item.icon}
              label={item.label}
              onPress={() => {
                if (state.index == idx) return;
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

const HomeDrawer = (
  props: NativeStackScreenProps<RootStackParamList, "home">
) => {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "permanent",
        drawerStyle: { width: "auto" },
        sceneContainerStyle: styles(theme).screenContainer,
        lazy: false,
      }}
      drawerContent={(drawerContentProps) => (
        <DrawerContent {...drawerContentProps} />
      )}
      initialRouteName="cashier"
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
  );
};

export default HomeDrawer;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    screenContainer: {
      backgroundColor: theme.colors.surface,
    },
    drawerContent: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 16,
    },
    drawerSection: {},
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
