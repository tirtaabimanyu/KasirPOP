import { Image, Platform, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  List,
  MD3Theme,
  Switch,
  Text,
  TextInput,
  TextProps,
  useTheme,
} from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import Row from "../components/Row";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { updateSettings } from "../redux/slices/settingsSlice";
import { useDatabaseConnection } from "../data/connection";
import { showSnackbar } from "../redux/slices/layoutSlice";
import { PaperSize, PaymentType } from "../types/data";
import {
  PrinterData,
  StarPrinterService,
} from "../services/StarPrinterService";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";
import { ReceiptFormatter, ReceiptRowType } from "../services/ReceiptFormatter";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/routes";

const FixedWidthText = (props: TextProps<string>) => {
  const { children, style, ...rest } = props;
  const fontFamily = Platform.OS === "ios" ? "Courier New" : "monospace";

  return (
    <Text {...rest} style={[{ fontFamily }, style]}>
      {children + `\u00AD`}
    </Text>
  );
};

const PrinterSettingsScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "printerSettings">) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settingsService } = useDatabaseConnection();
  const { storeSettings, printerSettings } = useAppSelector(
    (state) => state.settings
  );
  const printerService = new StarPrinterService();

  const initialData = {
    showLogo: printerSettings.showLogo,
    showQueueNumber: printerSettings.showQueueNumber,
    paperSize: printerSettings.paperSize,
    receiptFooter: printerSettings.receiptFooter,
    footerLink: printerSettings.footerLink,
    footerLinkAsQR: printerSettings.footerLinkAsQR,
  };
  const [newPrinterSettings, setNewPrinterSettings] = useState(initialData);
  const hasUnsavedChanges =
    JSON.stringify(initialData) !== JSON.stringify(newPrinterSettings);

  const paperSize = [
    PaperSize.FIFTY_SEVEN,
    PaperSize.FIFTY_EIGHT,
    PaperSize.EIGHTY,
  ];

  const mockTransaction = {
    id: 1,
    createdAt: new Date().toString(),
    totalPrice: 90000,
    moneyReceived: 100000,
    change: 10000,
    paymentType: PaymentType.CASH,
    products: [
      { id: 1, name: "Bakso Komplit", price: 30000, quantity: 1 },
      { id: 2, name: "Pangsit Goreng Udang", price: 30000, quantity: 1 },
      { id: 3, name: "Pangsit Goreng Cumi", price: 30000, quantity: 1 },
    ],
    queueNumber: 1,
  };
  const content = new ReceiptFormatter().format(
    mockTransaction,
    {
      ...newPrinterSettings,
      autoPrintReceipt: printerSettings.autoPrintReceipt,
      autoPrintKitchenReceipt: printerSettings.autoPrintKitchenReceipt,
    },
    storeSettings
  );

  const saveSettings = () => {
    dispatch(
      updateSettings({
        data: { printerSettings: newPrinterSettings },
        service: settingsService,
      })
    ).then(() => {
      dispatch(showSnackbar({ message: "Pengaturan struk telah diperbarui" }));
    });
  };

  const [btAlert, showBtAlert, hideBtAlert] = useDialog();

  const [discoveredPrinters, setDiscoveredPrinters] = useState<PrinterData[]>(
    []
  );
  const [isDiscovering, setIsDiscovering] = useState(false);
  const onPressDiscover = async () => {
    const btStatus = await BluetoothStateManager.getState();
    if (btStatus == "PoweredOff") {
      showBtAlert();
      return;
    }

    setDiscoveredPrinters([]);
    setIsDiscovering(true);
    printerService.startDiscovery(
      (printerData) =>
        setDiscoveredPrinters((state) => [...state, printerData]),
      () => setIsDiscovering(false)
    );
  };

  const onSelectPrinter = (printerData: PrinterData) => {
    dispatch(
      updateSettings({
        data: {
          printerSettings: {
            printerIdentifier: printerData.identifier,
            printerInterfaceType: printerData.interfaceType,
            printerName: printerData.name,
          },
        },
        service: settingsService,
      })
    ).then(() => {
      setDiscoveredPrinters([]);
      dispatch(
        showSnackbar({ message: "Pengaturan printer telah diperbarui." })
      );
    });
  };

  const onRemovePrinter = () => {
    dispatch(
      updateSettings({
        data: {
          printerSettings: {
            autoPrintReceipt: false,
            autoPrintKitchenReceipt: false,
            printerIdentifier: null,
            printerInterfaceType: null,
            printerName: null,
          },
        },
        service: settingsService,
      })
    ).then(() =>
      dispatch(
        showSnackbar({ message: "Pengaturan printer telah diperbarui." })
      )
    );
  };

  const onPressPrintSample = () => {
    const printerService = new StarPrinterService();
    printerService.printReceipt(
      mockTransaction,
      printerSettings,
      storeSettings
    );
  };

  const [backAlert, showBackAlert, hideBackAlert] = useDialog();
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!hasUnsavedChanges || backAlert) {
        return;
      }
      e.preventDefault();
      showBackAlert();
    });
    return unsubscribe;
  }, [navigation, hasUnsavedChanges, backAlert, showBackAlert]);

  return (
    <ScrollView
      contentContainerStyle={styles(theme).container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <BaseDialog
        visible={backAlert}
        onDismiss={hideBackAlert}
        dismissable={true}
      >
        <BaseDialog.Title>Apakah Anda yakin keluar halaman?</BaseDialog.Title>
        <BaseDialog.Content>
          <Text variant="bodyMedium">
            {`Perubahan yang ada di halaman ini akan hilang jika Anda keluar halaman.`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={hideBackAlert} style={{ paddingHorizontal: 16 }}>
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 24 }}
          >
            Keluar Halaman
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <BaseDialog visible={btAlert} dismissable onDismiss={hideBtAlert}>
        <BaseDialog.Title>Aktifkan Bluetooth</BaseDialog.Title>
        <BaseDialog.Content>
          <Text>
            {`Untuk mencari printer, Anda harus mengaktifkan Bluetooth pada perangkat ini.\n` +
              `Anda dapat mengaktifkan Bluetooth pada menu Pengaturan Bluetooth.`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={hideBtAlert}>Kembali</Button>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 16 }}
            onPress={() => {
              hideBtAlert();
              BluetoothStateManager.openSettings();
            }}
          >
            Cek Pengaturan Bluetooth
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <View style={styles(theme).leftContainer}>
        <View style={styles(theme).receiptPreview}>
          <View style={{ alignItems: "center" }}>
            {content.map((row, idx) =>
              row.type == ReceiptRowType.TEXT ? (
                <FixedWidthText
                  key={`receiptContent-${idx}`}
                  variant="bodyMedium"
                  style={{ textAlign: "center" }}
                >
                  {row.str}
                </FixedWidthText>
              ) : row.type == ReceiptRowType.LARGE_TEXT ? (
                <FixedWidthText
                  key={`receiptContent-${idx}`}
                  variant="titleLarge"
                  style={{ textAlign: "center" }}
                >
                  {row.str}
                </FixedWidthText>
              ) : row.type == ReceiptRowType.IMG ? (
                <Image
                  key={`receiptContent-${idx}`}
                  source={{ uri: row.str }}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <Image
                  key={`receiptContent-${idx}`}
                  source={require("../../assets/QR-Placeholder.png")}
                  style={{ width: 150, height: 150 }}
                />
              )
            )}
          </View>
        </View>
        <Text
          variant="bodySmall"
          style={{ textAlign: "center", width: "100%", marginBottom: 24 }}
        >
          {`Struk di atas hanyalah contoh\n` +
            `Untuk mengubah Logo, Nama, Alamat\n` +
            `dan Nomor Telepon Toko dapat dilakukan\n` +
            `di menu Informasi Toko`}
        </Text>
        <Button
          mode="contained"
          onPress={onPressPrintSample}
          disabled={printerSettings.printerIdentifier == undefined}
        >
          Cetak struk sampel
        </Button>
      </View>
      <View style={styles(theme).rightContainer}>
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: theme.colors.outlineVariant,
            marginBottom: 24,
          }}
          contentStyle={{ padding: 16 }}
        >
          <Text variant="titleMedium">Desain Struk</Text>
          <Divider
            style={{
              marginVertical: 16,
              backgroundColor: theme.colors.outlineVariant,
            }}
          />
          <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Text variant="bodyMedium">Tampilkan Logo Toko</Text>
            <Switch
              value={newPrinterSettings.showLogo}
              onValueChange={() =>
                setNewPrinterSettings((state) => ({
                  ...state,
                  showLogo: !state.showLogo,
                }))
              }
              disabled={storeSettings?.logoImgUri == undefined}
            />
          </Row>
          <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Text variant="bodyMedium">Tampilkan Nomor Antrian</Text>
            <Switch
              value={newPrinterSettings.showQueueNumber}
              onValueChange={() =>
                setNewPrinterSettings((state) => ({
                  ...state,
                  showQueueNumber: !state.showQueueNumber,
                }))
              }
            />
          </Row>
          <View style={{ marginBottom: 24 }}>
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>
              Lebar Struk (mm)
            </Text>
            <Row>
              {paperSize.map((size) => {
                const isSelected = newPrinterSettings.paperSize == size;
                return (
                  <Chip
                    key={`papersize-${size}`}
                    mode="outlined"
                    style={[
                      isSelected && {
                        backgroundColor: theme.colors.primaryContainer,
                      },
                      {
                        marginRight: 8,
                      },
                    ]}
                    onPress={() =>
                      setNewPrinterSettings((state) => ({
                        ...state,
                        paperSize: size,
                      }))
                    }
                    selected={isSelected}
                    showSelectedCheck={true}
                  >
                    {`${size}mm`}
                  </Chip>
                );
              })}
            </Row>
          </View>
          <TextInput
            multiline
            mode="outlined"
            label={"Informasi Footer (Opsional)"}
            style={{ marginBottom: 16 }}
            value={newPrinterSettings.receiptFooter}
            onChangeText={(text) =>
              setNewPrinterSettings((state) => ({
                ...state,
                receiptFooter: text,
              }))
            }
          />
          <TextInput
            multiline
            mode="outlined"
            label={"Tautan Footer (Opsional)"}
            style={{ marginBottom: 16 }}
            value={newPrinterSettings.footerLink}
            onChangeText={(text) =>
              setNewPrinterSettings((state) => ({
                ...state,
                footerLink: text,
              }))
            }
          />
          <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Text variant="bodyMedium">
              Tampilkan Tautan Footer Sebagai QR Code
            </Text>
            <Switch
              value={newPrinterSettings.footerLinkAsQR}
              onValueChange={() =>
                setNewPrinterSettings((state) => ({
                  ...state,
                  footerLinkAsQR: !state.footerLinkAsQR,
                }))
              }
            />
          </Row>
          <Button
            mode="contained"
            style={{ alignSelf: "center" }}
            onPress={saveSettings}
          >
            Simpan
          </Button>
        </Card>
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: theme.colors.outlineVariant,
            marginBottom: 24,
          }}
          contentStyle={{ padding: 16 }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Mekanisme Cetak Struk
          </Text>
          <Divider
            style={{
              marginVertical: 16,
              backgroundColor: theme.colors.outlineVariant,
            }}
          />
          <Text variant="bodyMedium">
            Jika dinyalakan, struk akan dicetak otomatis setelah pembayaran.
          </Text>
          <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Text variant="bodyMedium">Struk Pelanggan</Text>
            <Switch
              value={printerSettings.autoPrintReceipt}
              onValueChange={(value) => {
                dispatch(
                  updateSettings({
                    data: { printerSettings: { autoPrintReceipt: value } },
                    service: settingsService,
                  })
                ).then(() => {
                  dispatch(
                    showSnackbar({
                      message: "Pengaturan struk telah diperbarui",
                    })
                  );
                });
              }}
              disabled={printerSettings.printerIdentifier == undefined}
            />
          </Row>
          <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Text variant="bodyMedium">Struk Dapur</Text>
            <Switch
              value={printerSettings.autoPrintKitchenReceipt}
              onValueChange={(value) => {
                dispatch(
                  updateSettings({
                    data: {
                      printerSettings: { autoPrintKitchenReceipt: value },
                    },
                    service: settingsService,
                  })
                ).then(() => {
                  dispatch(
                    showSnackbar({
                      message: "Pengaturan struk telah diperbarui",
                    })
                  );
                });
              }}
              disabled={printerSettings.printerIdentifier == undefined}
            />
          </Row>
        </Card>
        <Card
          mode="outlined"
          style={{
            backgroundColor: "white",
            borderColor: theme.colors.outlineVariant,
          }}
          contentStyle={{ padding: 16 }}
        >
          <Text variant="titleMedium">Printer</Text>
          <Divider
            style={{
              marginVertical: 16,
              backgroundColor: theme.colors.outlineVariant,
            }}
          />
          {printerSettings.printerIdentifier == undefined ? (
            <>
              {discoveredPrinters.length == 0 ? (
                <>
                  <Text
                    variant="labelLarge"
                    style={{ textAlign: "center", marginBottom: 16 }}
                  >
                    Belum Ada Printer Terhubung
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ textAlign: "center", marginBottom: 16 }}
                  >
                    Cek koneksi printer di menu Pengaturan Bluetooth pada
                    perangkat ini. Setelah printer terhubung, klik tombol Cari
                    Printer di bawah ini.
                  </Text>
                </>
              ) : (
                <>
                  {discoveredPrinters.map((printer, idx) => (
                    <List.Item
                      key={`printer-${idx}`}
                      title={printer.name}
                      description={
                        printer.isConnected ? "Terhubung" : "Tidak Terhubung"
                      }
                      descriptionStyle={[
                        !printer.isConnected && { color: theme.colors.error },
                      ]}
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon={
                            printer.isConnected
                              ? "printer-check"
                              : "printer-alert"
                          }
                        />
                      )}
                      right={(props) => (
                        <Button
                          {...props}
                          mode="outlined"
                          disabled={!printer.isConnected}
                          onPress={() => onSelectPrinter(printer)}
                        >
                          Pilih Printer
                        </Button>
                      )}
                    />
                  ))}
                </>
              )}
              <Row style={{ justifyContent: "center" }}>
                <Button
                  mode="outlined"
                  onPress={() => BluetoothStateManager.openSettings()}
                  style={{ marginRight: 16 }}
                >
                  Cek Pengaturan Bluetooth
                </Button>
                <Button
                  icon={"printer-search"}
                  mode="contained"
                  onPress={onPressDiscover}
                  loading={isDiscovering}
                >
                  Cari Printer
                </Button>
              </Row>
            </>
          ) : (
            <List.Item
              title={printerSettings.printerName}
              left={(props) => <List.Icon {...props} icon={"printer-check"} />}
              right={(props) => (
                <Button
                  {...props}
                  mode="outlined"
                  onPress={() => onRemovePrinter()}
                >
                  Hapus Printer
                </Button>
              )}
            />
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

export default PrinterSettingsScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 32,
      paddingBottom: 32,
      flexDirection: "row",
    },
    leftContainer: {
      marginRight: 32,
    },
    rightContainer: {
      flex: 1,
    },
    receiptPreview: {
      backgroundColor: "white",
      padding: 16,
      fontFamily: "monospace",
      alignSelf: "center",
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      marginBottom: 24,
    },
  });
