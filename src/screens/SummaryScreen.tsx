import { StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import CashierItem from "../components/CashierItem";
import { FlatList } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import {
  CartState,
  addToCart,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { useEffect } from "react";
import { toRupiah } from "../utils/formatUtils";
import { AppDispatch } from "../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductData } from "../types/data";
import { RootStackParamList } from "../types/routes";
import FloatingRecap from "../components/FloatingRecap";

const RowSeparator = () => <View style={{ height: 12 }} />;

const NormalizedCashierItem = ({
  itemData,
  cart,
  dispatch,
}: {
  itemData: ProductData;
  cart: CartState;
  dispatch: AppDispatch;
}) => {
  const cartQuantity =
    itemData.id in cart.products ? cart.products[itemData.id].quantity : 0;

  return (
    <CashierItem
      itemData={itemData}
      onPressDecrease={() => dispatch(removeFromCart(itemData))}
      onPressIncrease={() => dispatch(addToCart(itemData))}
      cartQuantity={cartQuantity}
    />
  );
};

const SummaryScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "summary">) => {
  const theme = useTheme();
  const cartState = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cartState.totalItem == 0) navigation.navigate("home");
  }, [cartState.totalItem]);

  return (
    <View style={styles(theme).container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 200, paddingTop: 24 }}
        renderItem={({ item }) => (
          <NormalizedCashierItem
            itemData={item}
            cart={cartState}
            dispatch={dispatch}
          />
        )}
        data={Object.values(cartState.products)}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={RowSeparator}
      />
      <FloatingRecap
        contentText={`${cartState.totalItem} Produk • ${toRupiah(
          cartState.totalPrice
        )}`}
        buttonText="Bayar"
        onPressButton={() => navigation.navigate("payment")}
      />
    </View>
  );
};

export default SummaryScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
      width: "100%",
    },
  });
