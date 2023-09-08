import { StyleSheet, View } from "react-native";
import InventoryItem from "../components/InventoryItem";
import { Button, Card, MD3Theme, useTheme } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlatList } from "react-native-gesture-handler";
import { DrawerScreenProps } from "@react-navigation/drawer";

const Tab = createMaterialTopTabNavigator();

const RowSeparator = () => <View style={{ height: 16 }} />;
const Screen1 = () => (
  <FlatList
    contentContainerStyle={{ paddingBottom: 200, paddingTop: 24 }}
    renderItem={() => <InventoryItem itemData={{}} />}
    ItemSeparatorComponent={RowSeparator}
    data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
  />
);

export const InventoryScreen = (
  props: DrawerScreenProps<RootDrawerParamList>
) => {
  const theme = useTheme();
  return (
    <View style={styles(theme).container}>
      <Card.Title
        title="Inventori"
        titleVariant="headlineLarge"
        style={{ paddingLeft: 0, minHeight: 0 }}
        right={() => (
          <Button mode="contained" icon={"plus"}>
            Tambah Produk
          </Button>
        )}
      />
      <Tab.Navigator
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: theme.colors.surface },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Tab.Screen name="Semua" component={Screen1} />
        <Tab.Screen name="Aktif" component={Screen1} />
        <Tab.Screen name="Stok Habis (1)" component={Screen1} />
      </Tab.Navigator>
    </View>
  );
};

export default InventoryScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 32,
      paddingTop: 44,
    },
  });
