import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, List, Text, useTheme } from "react-native-paper";
import { RootStackParamList } from "../types/routes";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Row from "../components/Row";
import { View } from "react-native";
import { PaymentType } from "../types/data";
import { toRupiah } from "../utils/formatUtils";
import { useAppSelector } from "../hooks/typedStore";
import { StarPrinterService } from "../services/StarPrinterService";
import {
  StarIO10CommunicationError,
  StarIO10IllegalDeviceStateError,
  StarIO10UnprintableError,
} from "kasirbodoh-star-io10";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";
import { useState } from "react";

const PaymentSuccessScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "paymentSuccess">) => {
  const theme = useTheme();
  const { transactionData } = route.params;
  const { printerSettings, storeSettings } = useAppSelector(
    (state) => state.settings
  );

  const [connectErrorDialog, showConnectErrorDialog, hideConnectErrorDialog] =
    useDialog();
  const [printErrorDialog, showPrintErrorDialog, hidePrintErrorDialog] =
    useDialog();

  const [isPrinting, setIsPrinting] = useState(false);

  const onPressPrint = async () => {
    const printerService = new StarPrinterService();
    try {
      setIsPrinting(true);
      await printerService.printReceipt(
        transactionData,
        printerSettings,
        storeSettings
      );
    } catch (error) {
      if (
        error instanceof StarIO10IllegalDeviceStateError ||
        error instanceof StarIO10CommunicationError
      ) {
        showConnectErrorDialog();
      } else if (error instanceof StarIO10UnprintableError) {
        showPrintErrorDialog();
      }
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 16 }}
    >
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
          {/* <Button style={{ marginRight: 8 }}>Lanjutkan Tanpa Struk</Button> */}
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={() => {
              hideConnectErrorDialog();
              onPressPrint();
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
          {/* <Button style={{ marginRight: 8 }}>Lanjutkan Tanpa Struk</Button> */}
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={() => {
              hidePrintErrorDialog();
              onPressPrint();
            }}
          >
            Cetak Ulang Struk
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <MaterialCommunityIcons
          name="check"
          size={64}
          color={theme.colors.primary}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 64,
            marginBottom: 16,
            overflow: "hidden",
          }}
        />
        <Text variant="headlineLarge">Transaksi Berhasil</Text>
      </View>
      <Card
        mode="outlined"
        style={{
          backgroundColor: "white",
          borderColor: theme.colors.outlineVariant,
          marginBottom: 24,
        }}
        contentStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
        }}
      >
        <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <Text variant="bodyLarge">Metode Pembayaran</Text>
          <Text variant="bodyLarge">
            {transactionData.paymentType == PaymentType.CASH
              ? "Uang Tunai"
              : "QRIS"}
          </Text>
        </Row>
        <Row style={{ justifyContent: "space-between" }}>
          <Text variant="bodyLarge">Kembalian</Text>
          <Text variant="bodyLarge">{toRupiah(transactionData.change)}</Text>
        </Row>
      </Card>
      {printerSettings.printerIdentifier && (
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: theme.colors.outlineVariant,
            marginBottom: 24,
          }}
        >
          <List.Item
            title={printerSettings.printerName}
            left={(props) => <List.Icon {...props} icon={"printer-check"} />}
            right={(props) => (
              <Row {...props}>
                <Button
                  onPress={() => navigation.navigate("printerSettings")}
                  style={{ marginRight: 16 }}
                >
                  Ubah Printer
                </Button>
                <Button
                  mode="outlined"
                  onPress={onPressPrint}
                  loading={isPrinting}
                >
                  Cetak Struk
                </Button>
              </Row>
            )}
          />
        </Card>
      )}
      <Button
        mode="contained"
        style={{ alignSelf: "center" }}
        onPress={() => navigation.navigate("home", { screen: "cashier" })}
      >
        Kembali ke Halaman Kasir
      </Button>
    </ScrollView>
  );
};

export default PaymentSuccessScreen;
