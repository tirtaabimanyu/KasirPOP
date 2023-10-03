import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  ButtonProps,
  Card,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { RootStackParamList } from "../types/routes";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Row from "../components/Row";
import { View } from "react-native";
import { PaymentType } from "../types/data";
import { toRupiah } from "../utils/formatUtils";
import { useAppSelector } from "../hooks/typedStore";
import { StarPrinterService } from "../services/StarPrinterService";
import PrintButton from "../components/PrintButton";

const PaymentSuccessScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "paymentSuccess">) => {
  const theme = useTheme();
  const { transactionData } = route.params;
  const { printerSettings, storeSettings } = useAppSelector(
    (state) => state.settings
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 16 }}
    >
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <MaterialCommunityIcons
          name="check"
          size={64}
          color={theme.colors.primary}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 32,
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
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onPrimaryContainer }}
          >
            {toRupiah(transactionData.change)}
          </Text>
        </Row>
      </Card>
      {printerSettings.printerIdentifier && (
        <>
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
              <Text variant="bodyLarge">Struk Pelanggan</Text>
              <PrintButton
                mode="outlined"
                onPressPrint={async () => {
                  const printerService = new StarPrinterService();
                  await printerService.printReceipt(
                    transactionData,
                    printerSettings,
                    storeSettings
                  );
                }}
              >
                Cetak Struk Pelanggan
              </PrintButton>
            </Row>
            <Row style={{ justifyContent: "space-between" }}>
              <Text variant="bodyLarge">Struk Dapur</Text>
              <PrintButton
                mode="outlined"
                onPressPrint={async () => {
                  const printerService = new StarPrinterService();
                  await printerService.printKitchenReceipt(
                    transactionData,
                    printerSettings
                  );
                }}
              >
                Cetak Struk Dapur
              </PrintButton>
            </Row>
          </Card>
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
                <Button
                  {...props}
                  onPress={() => navigation.navigate("printerSettings")}
                  style={{ marginRight: 16 }}
                >
                  Ubah Printer
                </Button>
              )}
            />
          </Card>
        </>
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
