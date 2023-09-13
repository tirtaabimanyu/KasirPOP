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
import { toRupiah } from "../utils/currencyUtils";
import { AppDispatch, RootState } from "../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const RowSeparator = () => <View style={{ height: 12 }} />;

const NormalizedCashierItem = ({
  itemData,
  cart,
  dispatch,
}: {
  itemData: CashierItemData;
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
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cart.totalItem == 0) navigation.navigate("home");
  }, [cart.totalItem]);

  return (
    <View style={styles(theme).container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 200, paddingTop: 24 }}
        renderItem={({ item }) => (
          <NormalizedCashierItem
            itemData={item}
            cart={cart}
            dispatch={dispatch}
          />
        )}
        data={Object.values(cart.products)}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={RowSeparator}
      />
      <View style={styles(theme).floatingRecapContainer}>
        <View style={styles(theme).floatingRecap}>
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
            {`Total ${toRupiah(cart.totalPrice)}`}
          </Text>
          <Button
            mode="elevated"
            contentStyle={styles(theme).floatingRecapButton}
            labelStyle={styles(theme).floatingRecapButtonLabel}
            onPress={() => navigation.navigate("payment")}
          >
            Bayar
          </Button>
        </View>
      </View>
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
  });
