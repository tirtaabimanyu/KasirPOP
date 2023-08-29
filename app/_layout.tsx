import { Drawer } from "../components/Drawer";
import { DatabaseConnectionProvider } from "../data/connection";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <DatabaseConnectionProvider>
      <Drawer initialRouteName="index" defaultStatus="closed">
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Kasir",
            title: "Kasirbodoh",
          }}
        />
        <Drawer.Screen
          name="inventory"
          options={{
            drawerLabel: "Inventory",
            title: "Kasirbodoh",
          }}
        />
        <Drawer.Screen
          name="transactions"
          options={{
            drawerLabel: "Transactions",
            title: "Kasirbodoh",
          }}
        />
      </Drawer>
    </DatabaseConnectionProvider>
  );
}
