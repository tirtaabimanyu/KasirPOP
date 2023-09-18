import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, MD3Theme, Text, Button, Card } from "react-native-paper";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList } from "react-native-gesture-handler";

import CashierItem from "../../components/CashierItem";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStore";
import {
  addToCart,
  removeFromCart,
  updateCartAmount,
} from "../../redux/slices/cartSlice";
import { toRupiah } from "../../utils/formatUtils";
import { updateProduct } from "../../redux/slices/productSlice";
import { useDatabaseConnection } from "../../data/connection";
import { CategoryData, ProductData } from "../../types/data";
import { HomeDrawerParamList, RootStackParamList } from "../../types/routes";

type TabScreenParams = {
  category: CategoryData;
};
type CashierTopTabParamList = {
  [key: string]: TabScreenParams;
};
const Tab = createMaterialTopTabNavigator<CashierTopTabParamList>();

const NormalizedCashierItem = ({
  itemData,
  index,
}: {
  itemData: ProductData;
  index: number;
}) => {
  const services = useDatabaseConnection();
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
      editable={true}
      onChangeText={(value) =>
        dispatch(updateCartAmount({ ...itemData, quantity: value }))
      }
      onPressSaveUpdateStock={(data) =>
        dispatch(updateProduct({ data: { ...itemData, ...data }, services }))
      }
      cartQuantity={cartQuantity}
    />
  );
};

interface TabFlatListProps
  extends MaterialTopTabScreenProps<CashierTopTabParamList> {
  data: ProductData[];
}
const TabFlatList = (props: TabFlatListProps) => (
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
    data={props.data}
    numColumns={2}
    showsVerticalScrollIndicator={false}
  />
);

const AllFlatList = (
  props: MaterialTopTabScreenProps<CashierTopTabParamList>
) => {
  const productState = useAppSelector((state) => state.product);

  return <TabFlatList {...props} data={productState.products} />;
};

const CategoryFlatList = (
  props: MaterialTopTabScreenProps<CashierTopTabParamList>
) => {
  const productState = useAppSelector((state) => state.product);
  const { category } = props.route.params;
  const filteredProducts = productState.products.filter(
    (product: ProductData) => {
      const productCategoryIds = product.categories?.map(
        (category) => category.id
      );
      return productCategoryIds?.includes(category.id);
    }
  );

  return <TabFlatList {...props} data={filteredProducts} />;
};

const CashierScreen = ({
  navigation,
}: CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, "cashier">,
  NativeStackScreenProps<RootStackParamList, "home">
>) => {
  const theme = useTheme();
  const cartState = useAppSelector((state) => state.cart);
  const categoryState = useAppSelector((state) => state.category);

  const [tabScreens, setTabScreens] = useState<
    {
      name: string;
      component: (
        props: MaterialTopTabScreenProps<CashierTopTabParamList>
      ) => React.JSX.Element;
      initialParams: TabScreenParams;
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      setTabScreens([]);
      categoryState.categories.forEach(async (category) => {
        const component = CategoryFlatList;
        const tabScreen = {
          name: category.name,
          component: component,
          initialParams: {
            category: category,
          },
        };
        setTabScreens((state) => [...state, tabScreen]);
      });
    }, [categoryState])
  );

  return (
    <View style={styles(theme).container}>
      <Card.Title
        title="Kasir"
        titleVariant="headlineLarge"
        style={{ paddingLeft: 0, minHeight: 0 }}
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
        <Tab.Screen name={"Semua"} component={AllFlatList} />
        {tabScreens.map((screen) => (
          <Tab.Screen
            key={`tabScreen-${screen.name}`}
            name={screen.name}
            component={screen.component}
            initialParams={screen.initialParams}
          />
        ))}
      </Tab.Navigator>
      {Object.keys(cartState.products).length > 0 && (
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
