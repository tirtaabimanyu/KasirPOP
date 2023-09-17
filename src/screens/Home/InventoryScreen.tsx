import { StyleSheet, View } from "react-native";
import InventoryItem from "../../components/InventoryItem";
import {
  Button,
  Card,
  MD3Theme,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { FlatList } from "react-native-gesture-handler";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../../data/connection";
import { useCallback, useState } from "react";
import { ProductModel } from "../../data/entities/ProductModel";
import BaseDialog from "../../components/BaseDialog";
import InputCounter from "../../components/InputCounter";

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
}
const TabFlatList = (props: TabFlatListProps) => {
  const { productRepository } = useDatabaseConnection();
  const updateStock =
    (itemData: ProductData) => (newStockData: ProductStockData) => {
      productRepository.update({ ...itemData, ...newStockData });
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
  const { productRepository } = useDatabaseConnection();
  const [products, setProducts] = useState<ProductData[]>([]);
  const inStockProducts = products.filter(
    (product) => product.isAlwaysInStock || product.stock > 0
  );
  const outOfStockProducts = products.filter(
    (product) => !product.isAlwaysInStock && product.stock == 0
  );

  const fetch = useCallback(async () => {
    const products = await productRepository.getAll();
    const serializedProducts: ProductData[] = [];
    products.forEach((v) => {
      const categories: CategoryData[] = [];
      if (v.categories != undefined) {
        v.categories.forEach((category) => {
          categories.push({ id: category.id, name: category.name });
        });
      }
      const serializedData = {
        id: v.id,
        name: v.name,
        stock: v.stock,
        isAlwaysInStock: v.isAlwaysInStock,
        price: v.price,
        imgUri: v.imgUri,
        categories: categories,
      };
      serializedProducts.push(serializedData);
    });
    setProducts(serializedProducts);
  }, [productRepository, setProducts]);

  useFocusEffect(
    useCallback(() => {
      fetch();
    }, [])
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
            <Button
              mode="contained"
              icon={"minus"}
              onPress={async () => {
                await productRepository.deleteAll();
                await fetch();
              }}
            >
              Hapus Semua Produk
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
          {(tabProps) => <TabFlatList {...tabProps} data={products} />}
        </Tab.Screen>
        <Tab.Screen name="inStock" options={{ title: "Aktif" }}>
          {(tabProps) => <TabFlatList {...tabProps} data={inStockProducts} />}
        </Tab.Screen>
        <Tab.Screen
          name="outOfStock"
          options={{ title: `Stok Habis (${outOfStockProducts.length})` }}
        >
          {(tabProps) => (
            <TabFlatList {...tabProps} data={outOfStockProducts} />
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
