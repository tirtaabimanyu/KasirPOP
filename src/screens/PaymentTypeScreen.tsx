import { Image, Pressable, StyleSheet, View } from "react-native";
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

  return (
    <View style={styles(theme).container}>
      <BaseDialog visible={qrisDialog} dismissable onDismiss={hideQrisDialog}>
        <BaseDialog.Title>Unggah QRIS</BaseDialog.Title>
        <BaseDialog.Content>
          <InputImagePicker
            onSelectImage={(value) => console.log(value)}
            onRemoveImage={() => null}
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
      <Portal>
        <Modal
          visible={qrisImage}
          contentContainerStyle={{
            alignItems: "center",
          }}
          onDismiss={hideQrisImage}
        >
          <Pressable onPress={hideQrisImage}>
            <Image
              source={require("../helpers/QR_Static.png")}
              resizeMode="center"
            />
          </Pressable>
        </Modal>
      </Portal>
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
