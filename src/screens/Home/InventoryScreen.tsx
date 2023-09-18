import { StyleSheet, View } from "react-native";
import InventoryItem from "../../components/InventoryItem";
import { Button, Card, MD3Theme, useTheme } from "react-native-paper";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { FlatList } from "react-native-gesture-handler";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../../data/connection";
import { ProductModel } from "../../data/entities/ProductModel";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStore";
import { updateProduct } from "../../redux/slices/productSlice";
import { AppDispatch } from "../../redux/store";
import { HomeDrawerParamList, RootStackParamList } from "../../types/routes";
import { ProductData, ProductStockData } from "../../types/data";
import { DatabaseConnectionContextData } from "../../types/connection";

type TabFlatListType = {
  products: ProductModel[];
};
type InventoryTabParamList = {
  allProduct: TabFlatListType;
  inStock: TabFlatListType;
  outOfStock: TabFlatListType;
};
const Tab = createMaterialTopTabNavigator<InventoryTabParamList>();

interface TabFlatListProps
  extends CompositeScreenProps<
    MaterialTopTabScreenProps<InventoryTabParamList>,
    CompositeScreenProps<
      NativeStackScreenProps<RootStackParamList, "home">,
      DrawerScreenProps<HomeDrawerParamList, "inventory">
    >
  > {
  data: ProductData[];
  services: DatabaseConnectionContextData;
  dispatch: AppDispatch;
}
const TabFlatList = (props: TabFlatListProps) => {
  const updateStock =
    (itemData: ProductData) => (newStockData: ProductStockData) => {
      props.dispatch(
        updateProduct({
          data: { ...itemData, ...newStockData },
          services: props.services,
        })
      );
    };

  return (
    <FlatList
      {...props}
      contentContainerStyle={{ paddingVertical: 24 }}
      renderItem={({ item }) => (
        <InventoryItem
          itemData={item}
          onPressSaveUpdateStock={updateStock(item)}
          onPressUpdateDetail={() =>
            props.navigation.navigate("updateProduct", { productData: item })
          }
        />
      )}
      ItemSeparatorComponent={RowSeparator}
      data={props.data}
      showsVerticalScrollIndicator={false}
    />
  );
};

const RowSeparator = () => <View style={{ height: 24 }} />;

const InventoryScreen = ({
  navigation,
}: CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, "inventory">,
  NativeStackScreenProps<RootStackParamList, "home">
>) => {
  const theme = useTheme();
  const services = useDatabaseConnection();
  const dispatch = useAppDispatch();

  const productState = useAppSelector((state) => state.product);
  const inStockProducts = productState.products.filter(
    (product) => product.isAlwaysInStock || product.stock > 0
  );
  const outOfStockProducts = productState.products.filter(
    (product) => !product.isAlwaysInStock && product.stock == 0
  );

  return (
    <View style={styles(theme).container}>
      <Card.Title
        title="Inventori"
        titleVariant="headlineLarge"
        style={{ paddingLeft: 0, minHeight: 0 }}
        right={() => (
          <View style={{ flexDirection: "row" }}>
            <Button
              mode="contained"
              icon={"plus"}
              onPress={() => {
                navigation.navigate("addProduct");
              }}
            >
              Tambah Produk
            </Button>
          </View>
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
        <Tab.Screen name="allProduct" options={{ title: "Semua" }}>
          {(tabProps) => (
            <TabFlatList
              {...tabProps}
              data={productState.products}
              services={services}
              dispatch={dispatch}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="inStock" options={{ title: "Aktif" }}>
          {(tabProps) => (
            <TabFlatList
              {...tabProps}
              data={inStockProducts}
              services={services}
              dispatch={dispatch}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="outOfStock"
          options={{ title: `Stok Habis (${outOfStockProducts.length})` }}
        >
          {(tabProps) => (
            <TabFlatList
              {...tabProps}
              data={outOfStockProducts}
              services={services}
              dispatch={dispatch}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default InventoryScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 16,
    },
  });
