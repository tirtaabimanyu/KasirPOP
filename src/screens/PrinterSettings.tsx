import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
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
import { useState } from "react";
import { updateSettings } from "../redux/slices/settingsSlice";
import { useDatabaseConnection } from "../data/connection";
import { showSnackbar } from "../redux/slices/layoutSlice";
import { PaperSize } from "../types/data";
import {
  PrinterData,
  StarPrinterService,
} from "../services/StarPrinterService";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";

const lineBreak = (
  charactersPerLine: number,
  paddingCharacter: string = " "
) => {
  return `${paddingCharacter.repeat(charactersPerLine)}`;
};

const alignLeft = (
  str: string,
  charactersPerLine: number,
  paddingCharacter: string = " "
) => {
  const paddingLength = charactersPerLine - str.length;
  return `${str}${paddingCharacter.repeat(paddingLength)}`;
};

const alignRight = (
  str: string,
  charactersPerLine: number,
  paddingCharacter: string = " "
) => {
  const paddingLength = charactersPerLine - str.length;
  return `${paddingCharacter.repeat(paddingLength)}${str}`;
};

const breakWord = (
  str: string,
  breakAt: number,
  align: "left" | "center" | "right" = "center"
) => {
  const result: string[] = [];
  str.split("\n").forEach((current) => {
    if (current.length == 0) {
      result.push("");
      return;
    }

    let i = 0;
    while (i < current.length) {
      let currentLine = current.substring(i, i + breakAt);
      let rightmostSpace = currentLine.lastIndexOf(" ");
      let brokenLine;
      if (i + breakAt >= current.length) {
        brokenLine = currentLine;
        i = i + breakAt;
      } else if (rightmostSpace == -1) {
        brokenLine = current.substring(i, i + breakAt);
        i = i + breakAt;
      } else {
        brokenLine = current.substring(i, i + rightmostSpace);
        i = i + rightmostSpace + 1;
      }
      if (align == "left") {
        brokenLine = alignLeft(brokenLine, breakAt);
      } else if (align == "right") {
        brokenLine = alignRight(brokenLine, breakAt);
      }
      result.push(brokenLine);
    }
  });

  return result.join("\n");
};

const spaceBetween = (
  str1: string,
  str2: string,
  numOfChars: number,
  paddingCharacter: string = " "
) => {
  const paddingLength = numOfChars - str1.length - str2.length;

  return `${str1}${paddingCharacter.repeat(paddingLength)}${str2}`;
};

interface FixedWidthTextProps extends TextProps<string> {
  charactersPerLine: number;
}
const FixedWidthText = (props: FixedWidthTextProps) => {
  const { children, style, charactersPerLine, ...rest } = props;
  const fontFamily = Platform.OS === "ios" ? "Courier New" : "monospace";

  return (
    <Text {...rest} style={[{ fontFamily }, style]}>
      {children}
    </Text>
  );
};

const PrinterSettings = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settingsService } = useDatabaseConnection();
  const { storeSettings, printerSettings } = useAppSelector(
    (state) => state.settings
  );
  const printerService = new StarPrinterService();

  const [newPrinterSettings, setNewPrinterSettings] = useState({
    autoPrintReceipt: printerSettings.autoPrintReceipt,
    showLogo: printerSettings.showLogo,
    showQueueNumber: printerSettings.showQueueNumber,
    paperSize: printerSettings.paperSize,
    receiptFooter: printerSettings.receiptFooter,
  });

  const paperSize = [
    PaperSize.FIFTY_SEVEN,
    PaperSize.FIFTY_EIGHT,
    PaperSize.EIGHTY,
  ];

  const charactersPerLine =
    newPrinterSettings.paperSize == PaperSize.FIFTY_SEVEN
      ? 30
      : newPrinterSettings.paperSize == PaperSize.FIFTY_EIGHT
      ? 32
      : 48;

  const header = [
    ...(storeSettings?.name
      ? [breakWord(storeSettings.name, charactersPerLine)]
      : []),
    ...(storeSettings?.address
      ? [breakWord(storeSettings.address, charactersPerLine)]
      : []),
    ...(storeSettings?.phoneNumber
      ? [breakWord(storeSettings.phoneNumber, charactersPerLine)]
      : []),
  ];
  const content = [
    ...header,
    lineBreak(charactersPerLine, "-"),
    ...(newPrinterSettings.showQueueNumber
      ? [breakWord("Antrian 166", charactersPerLine)]
      : []),
    spaceBetween("12/10/23", "14:30 WIB", charactersPerLine),
    lineBreak(charactersPerLine, "-"),
    breakWord("Bakso Komplit", charactersPerLine, "left"),
    spaceBetween("1 X @30,000", "30,000", charactersPerLine),
    breakWord("Pangsit Goreng Udang", charactersPerLine, "left"),
    spaceBetween("1 X @30,000", "30,000", charactersPerLine),
    breakWord("Pangsit Goreng Cumi", charactersPerLine, "left"),
    spaceBetween("1 X @30,000", "30,000", charactersPerLine),
    lineBreak(charactersPerLine, "-"),
    breakWord(
      "Total : " + alignRight("90,000", 11),
      charactersPerLine,
      "right"
    ),
    breakWord(
      "Tunai : " + alignRight("100,000", 11),
      charactersPerLine,
      "right"
    ),
    breakWord(
      "Kembali : " + alignRight("10,000", 11),
      charactersPerLine,
      "right"
    ),
    ...(newPrinterSettings.receiptFooter.length > 0
      ? [
          lineBreak(charactersPerLine, "-"),
          breakWord(newPrinterSettings.receiptFooter, charactersPerLine),
        ]
      : []),
  ];

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
            ...newPrinterSettings,
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

  return (
    <ScrollView
      contentContainerStyle={styles(theme).container}
      keyboardShouldPersistTaps="handled"
    >
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
            {newPrinterSettings.showLogo && (
              <>
                <Image
                  source={{ uri: storeSettings?.logoImgUri }}
                  style={{ width: 100, height: 100 }}
                />
                <FixedWidthText
                  variant="bodyMedium"
                  style={{ textAlign: "center" }}
                  charactersPerLine={32}
                >
                  {""}
                </FixedWidthText>
              </>
            )}
            {content.map((text, idx) => (
              <FixedWidthText
                key={`receiptContent-${idx}`}
                variant="bodyMedium"
                style={{ textAlign: "center" }}
                charactersPerLine={32}
              >
                {text}
              </FixedWidthText>
            ))}
          </View>
        </View>
        <Text
          variant="bodySmall"
          style={{ textAlign: "center", width: "100%" }}
        >
          {`Struk di atas hanyalah contoh\n` +
            `Untuk mengubah Logo, Nama, Alamat\n` +
            `dan Nomor Telepon Toko dapat dilakukan\n` +
            `di menu Informasi Toko`}
        </Text>
      </View>
      <View style={styles(theme).rightContainer}>
        <Card
          mode="outlined"
          style={{ backgroundColor: "white", marginBottom: 24 }}
          contentStyle={{ padding: 16 }}
        >
          <Text variant="titleMedium">Struk</Text>
          <Divider
            style={{
              marginVertical: 16,
              backgroundColor: theme.colors.outlineVariant,
            }}
          />
          <Row style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Text variant="bodyMedium">
              Otomatis Cetak Struk Setelah Pembayaran
            </Text>
            <Switch
              value={newPrinterSettings.autoPrintReceipt}
              onValueChange={() =>
                setNewPrinterSettings((state) => ({
                  ...state,
                  autoPrintReceipt: !state.autoPrintReceipt,
                }))
              }
            />
          </Row>
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
          style={{ backgroundColor: "white" }}
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

export default PrinterSettings;

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
