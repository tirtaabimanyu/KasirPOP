import { Image, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  MD3Theme,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import NumericKeyboard from "../components/NumericKeyboard";
import { toFormattedDate, toRupiah } from "../utils/formatUtils";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { resetCart } from "../redux/slices/cartSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/routes";
import {
  createTransaction,
  fetchQueueNumber,
} from "../redux/slices/transactionSlice";
import { useDatabaseConnection } from "../data/connection";
import { PaymentType } from "../types/data";
import FloatingRecap from "../components/FloatingRecap";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";
import { StarPrinterService } from "../services/StarPrinterService";
import {
  StarIO10CommunicationError,
  StarIO10IllegalDeviceStateError,
  StarIO10UnprintableError,
} from "kasirbodoh-star-io10";

const PaymentScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "payment">) => {
  const theme = useTheme();
  const services = useDatabaseConnection();
  const cart = useAppSelector((state) => state.cart);
  const queueNumber = useAppSelector((state) => state.transaction.nextQueue);
  const queueDate = useAppSelector((state) => state.transaction.queueDate);
  const { paymentSettings, printerSettings, storeSettings } = useAppSelector(
    (state) => state.settings
  );
  const dispatch = useAppDispatch();

  const today = new Date();
  useEffect(() => {
    if (toFormattedDate(today) != queueDate) {
      dispatch(
        fetchQueueNumber({ date: today, service: services.transactionService })
      );
    }
  }, [today]);

  useEffect(() => {
    if (cart.totalItem == 0) navigation.navigate("home");
  }, [cart.totalItem]);

  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CASH);
  const availablePaymentTypes = [
    {
      value: PaymentType.CASH,
      label: "Uang Tunai",
      showSelectedCheck: true,
    },
    ...(paymentSettings.qris
      ? [
          {
            value: PaymentType.QRIS,
            label: "QRIS",
            showSelectedCheck: true,
          },
        ]
      : []),
  ];

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

  const [connectErrorDialog, showConnectErrorDialog, hideConnectErrorDialog] =
    useDialog();
  const [printErrorDialog, showPrintErrorDialog, hidePrintErrorDialog] =
    useDialog();

  const onCreateTransaction = async () => {
    const transactionData = await dispatch(
      createTransaction({
        data: {
          products: Object.values(cart.products),
          totalPrice: cart.totalPrice,
          moneyReceived: moneyReceived,
          change: totalChange,
          paymentType: paymentType,
          queueNumber: queueNumber,
        },
        services: services,
      })
    ).unwrap();
    dispatch(resetCart());
    navigation.navigate("paymentSuccess", { transactionData });
  };

  const [isPrinting, setIsPrinting] = useState(false);

  const onPressPay = async () => {
    const data = {
      createdAt: new Date().toISOString(),
      products: Object.values(cart.products),
      totalPrice: cart.totalPrice,
      moneyReceived: moneyReceived,
      change: totalChange,
      paymentType: paymentType,
      queueNumber: queueNumber,
    };

    if (printerSettings.autoPrintReceipt && printerSettings.printerIdentifier) {
      const printerService = new StarPrinterService();
      try {
        setIsPrinting(true);
        await printerService.printReceipt(
          { ...data, id: 0 },
          printerSettings,
          storeSettings
        );
        onCreateTransaction();
      } catch (error) {
        if (
          error instanceof StarIO10IllegalDeviceStateError ||
          error instanceof StarIO10CommunicationError
        ) {
          showConnectErrorDialog();
        } else if (error instanceof StarIO10UnprintableError) {
          showPrintErrorDialog();
        } else {
          console.log(error);
        }
      } finally {
        setIsPrinting(false);
      }
    } else {
      onCreateTransaction();
    }
  };

  return (
    <View style={styles(theme).container}>
      <BaseDialog
        visible={connectErrorDialog}
        dismissable
        onDismiss={hideConnectErrorDialog}
      >
        <BaseDialog.Title>
          <Text variant="headlineSmall">Printer tidak terhubung</Text>
        </BaseDialog.Title>
        <BaseDialog.Content>
          <Text>
            {`Pastikan beberapa hal di bawah ini lalu klik Cetak Ulang Struk:\n` +
              ` - Printer sudah menyala\n` +
              ` - Bluetooth perangkat ini aktif\n` +
              ` - Printer sudah terhubung dengan perangkat ini\n` +
              `\nJika Anda ingin melanjutkan semua transaksi tanpa cetak struk, matikan Otomatis Cetak pada Pengaturan Struk & Printer.`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button
            style={{ marginRight: 8 }}
            onPress={() => {
              hideConnectErrorDialog();
              onCreateTransaction();
            }}
          >
            Lanjutkan Tanpa Struk
          </Button>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={() => {
              hideConnectErrorDialog();
              onPressPay();
            }}
          >
            Cetak Ulang Struk
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <BaseDialog
        visible={printErrorDialog}
        dismissable
        onDismiss={hidePrintErrorDialog}
      >
        <BaseDialog.Title>
          <Text variant="headlineSmall">Cetak Struk Gagal</Text>
        </BaseDialog.Title>
        <BaseDialog.Content>
          <Text>
            {`Pastikan beberapa hal di bawah ini lalu klik Cetak Ulang Struk:\n` +
              ` - Printer memiliki kertas struk`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button
            style={{ marginRight: 8 }}
            onPress={() => {
              hidePrintErrorDialog();
              onCreateTransaction();
            }}
          >
            Lanjutkan Tanpa Struk
          </Button>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={() => {
              hidePrintErrorDialog();
              onPressPay();
            }}
          >
            Cetak Ulang Struk
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200, flexDirection: "row" }}
      >
        <View style={{ flex: 0.5, marginRight: 40 }}>
          {availablePaymentTypes.length > 1 ? (
            <SegmentedButtons
              value={paymentType}
              onValueChange={onPressPaymentType}
              buttons={availablePaymentTypes}
              style={{ marginBottom: 16 }}
            />
          ) : (
            <Button
              mode="outlined"
              icon={"check"}
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                marginBottom: 16,
              }}
              textColor={theme.colors.onSecondaryContainer}
            >
              Uang Tunai
            </Button>
          )}
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
            aspectRatio: 0.7,
          }}
        >
          {paymentType == PaymentType.CASH ? (
            <NumericKeyboard onKeyPress={onPressNumericKeyboard} />
          ) : (
            <View
              style={{
                flex: 1,
                height: "100%",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.colors.outlineVariant,
                overflow: "hidden",
              }}
            >
              <Image
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
                source={{ uri: paymentSettings.qrisImgUri }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {showFloatingRecap && (
        <FloatingRecap
          contentText={
            paymentType == PaymentType.CASH
              ? "Kembalian " + toRupiah(totalChange)
              : "Pastikan pembayaran sudah dilakukan"
          }
          buttonText={
            paymentType == PaymentType.CASH
              ? "Terima Pembayaran"
              : "Sudah Bayar"
          }
          onPressButton={onPressPay}
          isButtonLoading={isPrinting}
        />
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
