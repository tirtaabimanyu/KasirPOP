import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import {
  Button,
  Card,
  Chip,
  Dialog,
  MD3Theme,
  Portal,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";

const CashContainer = (
  <View>
    <Card
      mode="outlined"
      contentStyle={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: "center",
      }}
      style={{ marginBottom: 16 }}
    >
      <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
        Nominal Pembayaran
      </Text>
      <Text variant="headlineMedium">Rp200,000</Text>
    </Card>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Chip mode="outlined" style={{ marginRight: 16 }}>
        <Text variant="labelLarge">Uang Pas</Text>
      </Chip>
      <Chip mode="outlined" style={{ marginRight: 16 }}>
        <Text variant="labelLarge">Rp50,000</Text>
      </Chip>
      <Chip mode="outlined">
        <Text variant="labelLarge">Rp100,000</Text>
      </Chip>
    </View>
  </View>
);

const QrisContainer = <Text>Gambar QRIS</Text>;

type PaymentScreenProps = StackScreenProps<CashierStackParamList, "payment">;
const PaymentScreen = ({ navigation }: PaymentScreenProps) => {
  const theme = useTheme();
  const [paymentType, setPaymentType] = useState("cash");
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  return (
    <View style={styles(theme).container}>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
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
      <Card
        mode="outlined"
        contentStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          alignItems: "center",
        }}
        style={{ marginBottom: 24 }}
      >
        <Text variant="titleMedium">Total Tagihan : Rp150,000</Text>
      </Card>
      <SegmentedButtons
        value={paymentType}
        onValueChange={setPaymentType}
        buttons={[
          {
            value: "cash",
            label: "Uang Tunai",
            showSelectedCheck: true,
          },
          {
            value: "qris",
            label: "QRIS",
            showSelectedCheck: true,
          },
        ]}
        style={{ marginBottom: 24 }}
      />
      {paymentType == "cash" ? CashContainer : QrisContainer}

      <View style={styles(theme).floatingRecapContainer}>
        <View style={styles(theme).floatingRecap}>
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
            Total Rp150,000
          </Text>
          <Button
            mode="elevated"
            contentStyle={styles(theme).floatingRecapButton}
            labelStyle={styles(theme).floatingRecapButtonLabel}
            onPress={showDialog}
          >
            Bayar
          </Button>
        </View>
      </View>
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
      fontFamily: theme.fonts.labelLarge.fontFamily,
      fontSize: theme.fonts.labelLarge.fontSize,
      fontStyle: theme.fonts.labelLarge.fontStyle,
      fontWeight: theme.fonts.labelLarge.fontWeight,
    },
  });
