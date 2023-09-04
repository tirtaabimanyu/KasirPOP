import { Drawer } from "expo-router/drawer";
import { Provider as PaperProvider } from "react-native-paper";

import DrawerContent from "../../components/DrawerContent";
import { DatabaseConnectionProvider } from "../../data/connection";

export default function Layout() {
  return (
    <DatabaseConnectionProvider>
      <PaperProvider>
        <Drawer
          initialRouteName="cashier"
          screenOptions={{
            headerShown: false,
            drawerType: "permanent",
            drawerStyle: { width: "auto" },
          }}
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name="cashier" />
          <Drawer.Screen name="inventory" />
          <Drawer.Screen name="transactions" />
          <Drawer.Screen name="settings" />
        </Drawer>
      </PaperProvider>
    </DatabaseConnectionProvider>
  );
}
