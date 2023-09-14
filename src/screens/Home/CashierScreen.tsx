import { StyleSheet, View } from "react-native";
import {
  useTheme,
  MD3Theme,
  Text,
  Button,
  Card,
  ActivityIndicator,
} from "react-native-paper";

import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import CashierItem from "../../components/CashierItem";
import { FlatList } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStore";
import { addToCart, removeFromCart } from "../../redux/slices/cartSlice";
import { toRupiah } from "../../utils/currencyUtils";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../../data/connection";
import { useCallback, useEffect, useState } from "react";

type CashierTopTabParamList = {
  [key: string]: { products: ProductData[] };
};
const Tab = createMaterialTopTabNavigator<CashierTopTabParamList>();

const NormalizedCashierItem = ({
  itemData,
  index,
}: {
  itemData: ProductData;
  index: number;
}) => {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const cartQuantity =
    itemData.id in cart.products ? cart.products[itemData.id].quantity : 0;

  return (
    <CashierItem
      itemData={itemData}
      style={[
        { flex: 0.5 },
        index % 2 === 0 ? { marginRight: 16 } : { marginRight: 0 },
      ]}
      onPressDecrease={() => dispatch(removeFromCart(itemData))}
      onPressIncrease={() => dispatch(addToCart(itemData))}
      cartQuantity={cartQuantity}
    />
  );
};

const CashierScreen = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "home">,
  DrawerScreenProps<HomeDrawerParamList, "cashier">
>) => {
  const theme = useTheme();
  const cartState = useAppSelector((state) => state.cart);

  const { productsRepository } = useDatabaseConnection();
  const fetch = async () => {
    const products = await productsRepository.getAll();
    const serializedProducts: ProductData[] = [];
    products.forEach((product) =>
      serializedProducts.push({
        id: product.id.toString(),
        name: product.name,
        stock: product.stock,
        isAlwaysInStock: product.isAlwaysInStock,
        price: product.price,
        imgUri: product.imgUri,
      })
    );
    return serializedProducts;
  };

  const productCategories = ["Semua"];
  const [tabScreens, setTabScreens] = useState<
    {
      name: string;
      component: (
        props: MaterialTopTabScreenProps<CashierTopTabParamList>
      ) => React.JSX.Element;
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      setTabScreens([]);
      productCategories.forEach(async (category) => {
        const products = await fetch();
        const component = (
          props: MaterialTopTabScreenProps<CashierTopTabParamList>
        ) => (
          <FlatList
            {...props}
            contentContainerStyle={{ paddingBottom: 200, paddingTop: 24 }}
            columnWrapperStyle={{
              paddingBottom: 12,
              justifyContent: "space-between",
            }}
            renderItem={({ item, index }) => (
              <NormalizedCashierItem itemData={item} index={index} />
            )}
            data={products}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        );
        const tabScreen = {
          name: category,
          component: component,
        };
        setTabScreens([...tabScreens, tabScreen]);
        console.log(tabScreens);
      });
    }, [])
  );

  return (
    <View style={styles(theme).container}>
      <Card.Title
        title="Kasir"
        titleVariant="headlineLarge"
        style={{ paddingLeft: 0, minHeight: 0 }}
      />
      {tabScreens.length > 0 ? (
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
          {tabScreens.map((screen) => (
            <Tab.Screen key={`tabScreen-${screen.name}`} name={screen.name}>
              {screen.component}
            </Tab.Screen>
          ))}
        </Tab.Navigator>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {cartState.totalItem > 0 && (
        <View style={styles(theme).floatingRecapContainer}>
          <View style={styles(theme).floatingRecap}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimary }}
            >
              {`${cartState.totalItem} Produk • ${toRupiah(
                cartState.totalPrice
              )}`}
            </Text>
            <Button
              mode="elevated"
              contentStyle={styles(theme).floatingRecapButton}
              labelStyle={styles(theme).floatingRecapButtonLabel}
              onPress={() => navigation.navigate("summary")}
            >
              Lihat Pesanan
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default CashierScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
      paddingTop: 15,
      width: "100%",
    },
    floatingRecapContainer: {
      position: "absolute",
      alignSelf: "center",
      width: "100%",
      bottom: 0,
      paddingVertical: 28,
    },
    floatingRecap: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: 24,
      paddingVertical: 22,
      height: 72,
    },
    floatingRecapButton: {
      height: 40,
    },
    floatingRecapButtonLabel: {
      ...theme.fonts.labelLarge,
    },
    cashierItem: {
      flex: 0.5,
    },
  });
