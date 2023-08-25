import { Drawer } from "../components/Drawer";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <Drawer>
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
  );
}
