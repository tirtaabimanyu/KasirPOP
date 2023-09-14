import { StyleSheet, View } from "react-native";
import InventoryItem from "../../components/InventoryItem";
import { Button, Card, MD3Theme, Text, useTheme } from "react-native-paper";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { FlatList } from "react-native-gesture-handler";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../../data/connection";
import { useCallback, useEffect, useState } from "react";
import { ProductModel } from "../../data/entities/ProductModel";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStore";
import { AppDispatch } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";

type InventoryTabParamList = {
  semua: undefined;
  inStock: undefined;
  outOfStock: undefined;
};
const Tab = createMaterialTopTabNavigator<InventoryTabParamList>();

const RowSeparator = () => <View style={{ height: 24 }} />;
const Semua = ({
  route,
}: MaterialTopTabScreenProps<InventoryTabParamList, "semua">) => {
  const productsState = useAppSelector((state) => state.products);

  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: 24 }}
      renderItem={({ item }) => (
        <InventoryItem
          itemData={item}
          onPressEditStock={() => null}
          onPressEditDetail={() => null}
        />
      )}
      ItemSeparatorComponent={RowSeparator}
      data={productsState.products}
      showsVerticalScrollIndicator={false}
    />
  );
};

export const InventoryScreen = (
  props: CompositeScreenProps<
    NativeStackScreenProps<RootStackParamList, "home">,
    DrawerScreenProps<HomeDrawerParamList, "inventory">
  >
) => {
  const theme = useTheme();
  const { productsRepository } = useDatabaseConnection();

  const fetch = async (dispatch: AppDispatch) => {
    const products = await productsRepository.getAll();
    const serializedProducts: CashierItemData[] = [];
    products.forEach((v) =>
      serializedProducts.push({
        id: v.id.toString(),
        name: v.name,
        stock: v.stock,
        isAlwaysInStock: v.isAlwaysInStock,
        price: v.price,
        imgUri: v.imgUri,
      })
    );
    dispatch(fetchProducts(serializedProducts));
  };

  const dispatch = useAppDispatch();
  useFocusEffect(() => {
    fetch(dispatch);
  });

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
              onPress={async () => {
                await productsRepository.create({
                  name: Math.random().toString(),
                  stock: Math.round(Math.random()),
                  isAlwaysInStock: false,
                  price: 10000,
                });
                await fetch(dispatch);
              }}
            >
              Tambah Produk
            </Button>
            <Button
              mode="contained"
              icon={"minus"}
              onPress={async () => {
                await productsRepository.deleteAll();
                await fetch(dispatch);
              }}
            >
              Hapus Semua
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
        <Tab.Screen
          name="semua"
          options={{ title: "Semua" }}
          component={Semua}
        />
        {/* <Tab.Screen
          name="inStock"
          options={{ title: "Aktif" }}
          component={Screen1}
        />
        <Tab.Screen
          name="outOfStock"
          options={{ title: "Stok Habis" }}
          component={Screen1}
        /> */}
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
