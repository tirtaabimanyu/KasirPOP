import { Image, Platform, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  MD3Theme,
  Switch,
  Text,
  TextInput,
  TextProps,
  useTheme,
} from "react-native-paper";
import { useAppSelector } from "../hooks/typedStore";
import Row from "../components/Row";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";

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
  const { storeSettings } = useAppSelector((state) => state.settings);

  const paperSize = [57, 58, 80];
  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: storeSettings?.logoImgUri ? true : false,
    paperSize: 57,
    additionalFooter: "",
  });
  const charactersPerLine =
    receiptSettings.paperSize == 57
      ? 30
      : receiptSettings.paperSize == 58
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
    ...(receiptSettings.additionalFooter.length > 0
      ? [
          lineBreak(charactersPerLine, "-"),
          breakWord(receiptSettings.additionalFooter, charactersPerLine),
        ]
      : []),
  ];

  return (
    <ScrollView contentContainerStyle={styles(theme).container}>
      <View style={styles(theme).leftContainer}>
        <View style={styles(theme).receiptPreview}>
          <View style={{ alignItems: "center" }}>
            {receiptSettings.showLogo && (
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
            <Text variant="bodyMedium">Tampilkan Logo Toko</Text>
            <Switch
              value={receiptSettings.showLogo}
              onValueChange={() =>
                setReceiptSettings((state) => ({
                  ...state,
                  showLogo: !state.showLogo,
                }))
              }
              disabled={storeSettings?.logoImgUri == undefined}
            />
          </Row>
          <View style={{ marginBottom: 24 }}>
            <Text variant="bodySmall" style={{ marginBottom: 8 }}>
              Lebar Struk (mm)
            </Text>
            <Row>
              {paperSize.map((size) => {
                const isSelected = receiptSettings.paperSize == size;
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
                      setReceiptSettings((state) => ({
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
            value={receiptSettings.additionalFooter}
            onChangeText={(text) =>
              setReceiptSettings((state) => ({
                ...state,
                additionalFooter: text,
              }))
            }
          />
          <Button mode="contained" style={{ alignSelf: "center" }}>
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
          <Text
            variant="labelLarge"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            Belum Ada Printer Terhubung
          </Text>
          <Button
            icon={"plus"}
            mode="contained"
            style={{ alignSelf: "center" }}
          >
            Tambah Printer
          </Button>
        </Card>
      </View>
    </ScrollView>
  );
};

export default PrinterSettings;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
      width: "100%",
      flexDirection: "row",
    },
    leftContainer: {
      //   maxWidth: 300,
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
      //   maxWidth: 300,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      marginBottom: 24,
    },
  });
