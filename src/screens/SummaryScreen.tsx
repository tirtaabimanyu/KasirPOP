import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  List,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import CashierItem from "../components/CashierItem";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import {
  CartState,
  addToCart,
  removeFromCart,
  updateTableNumber,
} from "../redux/slices/cartSlice";
import { useEffect } from "react";
import { toNumber, toRupiah } from "../utils/formatUtils";
import { AppDispatch } from "../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductData } from "../types/data";
import { RootStackParamList } from "../types/routes";
import FloatingRecap from "../components/FloatingRecap";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      style={{ marginBottom: 16 }}
    />
  );
};

const SummaryScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "summary">) => {
  const theme = useTheme();
  const cartState = useAppSelector((state) => state.cart);
  const { printerSettings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cartState.totalItem == 0) navigation.navigate("home");
  }, [cartState.totalItem]);

  return (
    <View style={styles(theme).container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {Object.values(cartState.products).map((product, idx) => (
          <NormalizedCashierItem
            key={`cart-${idx}`}
            itemData={product}
            cart={cartState}
            dispatch={dispatch}
          />
        ))}
        {printerSettings.printerIdentifier && (
          <Card
            mode="outlined"
            style={{
              flex: 1,
              backgroundColor: "white",
              borderColor: theme.colors.outlineVariant,
            }}
            contentStyle={{
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <List.Accordion
              title={<Text variant="titleMedium">Informasi Tambahan</Text>}
              right={({ isExpanded }) => (
                <MaterialCommunityIcons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                />
              )}
              style={{ paddingRight: 16, backgroundColor: "white" }}
            >
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <Divider style={{ marginBottom: 16 }} />
                <TextInput
                  mode="outlined"
                  label="Nomor Meja (Opsional)"
                  style={{ backgroundColor: "white" }}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    dispatch(updateTableNumber(toNumber(text)))
                  }
                />
              </View>
            </List.Accordion>
          </Card>
        )}
      </ScrollView>
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
