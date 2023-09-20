import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  List,
  MD3Theme,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/routes";
import { useState } from "react";
import BaseDialog from "../components/BaseDialog";
import InputImagePicker from "../components/InputImagePicker";
import useDialog from "../hooks/useDialog";
import Row from "../components/Row";

const PaymentTypeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "paymentType">) => {
  const theme = useTheme();
  const [qrisChecked, setQrisChecked] = useState(false);
  const [qrisDialog, showQrisDialog, hideQrisDialog] = useDialog();
  const [qrisImage, showQrisImage, hideQrisImage] = useDialog();

  const qrisImageHeight = Dimensions.get("window").height * 0.7;
  const qrisImageWidth = qrisImageHeight * 0.7;

  return (
    <View style={styles(theme).container}>
      <BaseDialog visible={qrisDialog} dismissable onDismiss={hideQrisDialog}>
        <BaseDialog.Title>Unggah QRIS</BaseDialog.Title>
        <BaseDialog.Content>
          <InputImagePicker
            onSelectImage={(value) => console.log(value)}
            onRemoveImage={() => null}
            resize={{ height: 600, width: 420 }}
          />
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={hideQrisDialog} style={{ paddingHorizontal: 16 }}>
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={hideQrisDialog}
            style={{ paddingHorizontal: 24 }}
          >
            Unggah
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <BaseDialog visible={qrisImage} dismissable onDismiss={hideQrisImage}>
        <BaseDialog.Title>Lihat QRIS</BaseDialog.Title>
        <Image
          source={require("../helpers/QR_Static.png")}
          style={{
            width: qrisImageWidth,
            height: qrisImageHeight,
            alignSelf: "center",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
          }}
        />
        <BaseDialog.Actions style={{ padding: 24 }}>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={hideQrisImage}
          >
            Tutup
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <Card
        mode="outlined"
        style={[styles(theme).cardContainer, { marginBottom: 24 }]}
        contentStyle={styles(theme).cardContent}
      >
        <Text variant="titleMedium" style={styles(theme).sectionTitle}>
          Tunai
        </Text>
        <List.Item
          title="Uang Tunai"
          left={(props) => (
            <View style={{ justifyContent: "center" }}>
              <Checkbox {...props} status="checked" disabled />
            </View>
          )}
        />
      </Card>
      <Card
        mode="outlined"
        style={styles(theme).cardContainer}
        contentStyle={styles(theme).cardContent}
      >
        <Text variant="titleMedium" style={styles(theme).sectionTitle}>
          Non Tunai
        </Text>
        <List.Item
          title="QRIS"
          left={(props) => (
            <View style={{ justifyContent: "center" }}>
              <Checkbox
                {...props}
                status={qrisChecked ? "checked" : "unchecked"}
                color={theme.colors.primary}
                onPress={() => setQrisChecked((state) => !state)}
              />
            </View>
          )}
          right={(props) => (
            <Row>
              <Button mode="text" {...props} onPress={showQrisImage}>
                Lihat QRIS
              </Button>
              <Button mode="outlined" {...props} onPress={showQrisDialog}>
                Unggah QRIS
              </Button>
            </Row>
          )}
        />
      </Card>
    </View>
  );
};

export default PaymentTypeScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 16,
    },
    title: { paddingLeft: 0, minHeight: 0, marginBottom: 24 },
    sectionTitle: { color: theme.colors.outline },
    cardContainer: {
      backgroundColor: "white",
      borderColor: theme.colors.outlineVariant,
    },
    cardContent: {
      padding: 16,
    },
  });
