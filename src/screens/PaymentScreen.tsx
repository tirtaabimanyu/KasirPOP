import { Image, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Dialog,
  MD3Theme,
  Portal,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import NumericKeyboard from "../components/NumericKeyboard";
import { toRupiah } from "../utils/formatUtils";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { resetCart } from "../redux/slices/cartSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/routes";
import { createTransaction } from "../redux/slices/transactionSlice";
import { useDatabaseConnection } from "../data/connection";
import { PaymentType } from "../types/data";

const PaymentScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "payment">) => {
  const theme = useTheme();
  const services = useDatabaseConnection();
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cart.totalItem == 0) navigation.navigate("home");
  }, [cart.totalItem]);

  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CASH);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    dispatch(resetCart());
    setVisible(false);
    navigation.navigate("home");
  };

  const [moneyReceived, setMoneyReceived] = useState<number>(0);
  const totalChange = moneyReceived - cart.totalPrice;

  const onPressNumericKeyboard = (value: string) => {
    const currentValue = moneyReceived;
    if (value === "clear") {
      setMoneyReceived(0);
    } else if (value === "exact") {
      setMoneyReceived(cart.totalPrice);
    } else if (value === "backspace") {
      setMoneyReceived(Math.trunc(currentValue / 10));
    } else if (value === "000") {
      setMoneyReceived(moneyReceived * 1000);
    } else {
      setMoneyReceived(currentValue * 10 + Number(value));
    }
  };

  const onPressPaymentType = (value: string) => {
    if (value == PaymentType.CASH) {
      setMoneyReceived(0);
      setPaymentType(value);
    } else if (value == PaymentType.QRIS) {
      setMoneyReceived(cart.totalPrice);
      setPaymentType(value);
    }
  };

  let showFloatingRecap = false;
  if (
    paymentType == PaymentType.QRIS ||
    (paymentType == PaymentType.CASH && totalChange >= 0)
  ) {
    showFloatingRecap = true;
  }

  const onCreateTransaction = () => {
    dispatch(
      createTransaction({
        data: {
          products: Object.values(cart.products),
          totalPrice: cart.totalPrice,
          paymentType: paymentType,
        },
        services: services,
      })
    );
    showDialog();
  };

  return (
    <View style={styles(theme).container}>
      <Portal>
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Icon
            icon={"check-circle"}
            size={24}
            color={theme.colors.primary}
          />
          <Dialog.Title style={{ textAlign: "center" }}>
            Transaksi Sudah Selesai
          </Dialog.Title>
          <Dialog.Actions>
            <Button onPress={hideDialog} style={{ paddingHorizontal: 16 }}>
              Cetak Struk Dapur
            </Button>
            <Button
              mode="contained"
              onPress={hideDialog}
              style={{ paddingHorizontal: 24 }}
            >
              Tutup
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200, flexDirection: "row" }}
      >
        <View style={{ flex: 0.5, marginRight: 40 }}>
          <SegmentedButtons
            value={paymentType}
            onValueChange={onPressPaymentType}
            buttons={[
              {
                value: PaymentType.CASH,
                label: "Uang Tunai",
                showSelectedCheck: true,
              },
              {
                value: PaymentType.QRIS,
                label: "QRIS",
                showSelectedCheck: true,
              },
            ]}
            style={{ marginBottom: 16 }}
          />
          <Card
            mode="outlined"
            contentStyle={{
              paddingHorizontal: 24,
              paddingVertical: 16,
              alignItems: "center",
            }}
            style={{ marginBottom: 16 }}
          >
            <Text variant="titleMedium">
              Total Tagihan : {toRupiah(cart.totalPrice)}
            </Text>
          </Card>
          <Card
            mode="outlined"
            contentStyle={{
              paddingHorizontal: 24,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
              Nominal Pembayaran
            </Text>
            <Text
              variant="displayMedium"
              style={{ color: theme.colors.primary }}
            >
              {toRupiah(moneyReceived)}
            </Text>
          </Card>
        </View>
        <View
          style={{
            flex: 0.5,
            aspectRatio: 0.709375,
          }}
        >
          {paymentType == PaymentType.CASH ? (
            <NumericKeyboard onKeyPress={onPressNumericKeyboard} />
          ) : (
            <View style={{ flex: 1, height: "100%" }}>
              <Image
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
                source={require("../helpers/QR_Static.png")}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {showFloatingRecap && (
        <View style={styles(theme).floatingRecapContainer}>
          <View style={styles(theme).floatingRecap}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimary }}
            >
              {paymentType == PaymentType.CASH
                ? "Kembalian " + toRupiah(totalChange)
                : "Pastikan pembayaran sudah dilakukan"}
            </Text>
            <Button
              mode="elevated"
              contentStyle={styles(theme).floatingRecapButton}
              labelStyle={styles(theme).floatingRecapButtonLabel}
              onPress={onCreateTransaction}
            >
              {paymentType == PaymentType.CASH
                ? "Terima Pembayaran"
                : "Sudah Bayar"}
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default PaymentScreen;

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
