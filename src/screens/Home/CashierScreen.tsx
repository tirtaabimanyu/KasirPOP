import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, MD3Theme, Card } from "react-native-paper";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
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
import FloatingRecap from "../../components/FloatingRecap";
import { showSnackbar } from "../../redux/slices/layoutSlice";

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
  const { productService } = useDatabaseConnection();
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
        dispatch(
          updateProduct({
            data: { ...itemData, ...data },
            service: productService,
          })
        ).then(() =>
          dispatch(
            showSnackbar({ message: `Stok ${itemData.name} telah diperbarui.` })
          )
        )
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
    automaticallyAdjustKeyboardInsets
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
      return product.categoryIds?.includes(category.id);
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

  useEffect(() => {
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
  }, [categoryState]);

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
      {cartState.totalItem > 0 && (
        <FloatingRecap
          contentText={`${cartState.totalItem} Produk • ${toRupiah(
            cartState.totalPrice
          )}`}
          buttonText="Lihat Pesanan"
          onPressButton={() => navigation.navigate("summary")}
        />
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
      paddingTop: 16,
      width: "100%",
    },
    cashierItem: {
      flex: 0.5,
    },
  });
