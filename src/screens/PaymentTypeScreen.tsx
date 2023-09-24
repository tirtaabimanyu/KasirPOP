import { Dimensions, Image, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  List,
  MD3Theme,
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
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { useDatabaseConnection } from "../data/connection";
import { updateSettings } from "../redux/slices/settingsSlice";
import { UpdateCombinedSettingsData } from "../types/data";
import { showSnackbar } from "../redux/slices/layoutSlice";

const ShowQrisImageDialog = ({
  visible,
  onDismiss,
  uri,
  theme,
}: {
  visible: boolean;
  onDismiss: () => void;
  uri: string | undefined;
  theme: MD3Theme;
}) => {
  const qrisImageHeight = Dimensions.get("window").height * 0.7;
  const qrisImageWidth = qrisImageHeight * 0.7;

  return (
    <BaseDialog visible={visible} dismissable onDismiss={onDismiss}>
      <BaseDialog.Title>Lihat QRIS</BaseDialog.Title>
      <Image
        source={{ uri: uri }}
        style={[
          styles(theme).qrisImg,
          {
            width: qrisImageWidth,
            height: qrisImageHeight,
          },
        ]}
      />
      <BaseDialog.Actions style={{ padding: 24 }}>
        <Button
          mode="contained"
          style={{ paddingHorizontal: 24 }}
          onPress={onDismiss}
        >
          Tutup
        </Button>
      </BaseDialog.Actions>
    </BaseDialog>
  );
};

const UploadQrisDialog = ({
  visible,
  onDismiss,
  onSave,
  imgUri,
}: {
  visible: boolean;
  onDismiss: () => void;
  onSave: (uri: string | undefined) => void;
  imgUri?: string;
}) => {
  const [newImgUri, setNewImgUri] = useState<string | undefined>(imgUri);
  const isEdit = imgUri != undefined;

  const onPressDismiss = () => {
    setNewImgUri(imgUri);
    onDismiss();
  };

  return (
    <BaseDialog visible={visible} dismissable onDismiss={onPressDismiss}>
      <BaseDialog.Title>
        {isEdit ? "Ubah QRIS" : "Unggah QRIS"}
      </BaseDialog.Title>
      <BaseDialog.Content>
        <InputImagePicker
          imgUri={newImgUri}
          onSelectImage={setNewImgUri}
          onRemoveImage={() => setNewImgUri(undefined)}
          resize={{ height: 1000, width: 700 }}
        />
      </BaseDialog.Content>
      <BaseDialog.Actions>
        <Button onPress={onPressDismiss} style={{ paddingHorizontal: 16 }}>
          Batal
        </Button>
        <Button
          mode="contained"
          onPress={() => onSave(newImgUri)}
          style={{ paddingHorizontal: 24 }}
          disabled={newImgUri == undefined}
        >
          {isEdit ? "Ubah" : "Unggah"}
        </Button>
      </BaseDialog.Actions>
    </BaseDialog>
  );
};

const PaymentTypeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "paymentType">) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settingsService } = useDatabaseConnection();
  const settingsState = useAppSelector((state) => state.settings);

  const [uploadQrisDialog, showUploadQrisDialog, hideUploadQrisDialog] =
    useDialog();

  const [qrisImage, showQrisImage, hideQrisImage] = useDialog();

  const toggleQris = () => {
    const qrisChecked = settingsState.paymentSettings.qris;
    const newState: UpdateCombinedSettingsData = {
      ...settingsState,
      paymentSettings: {
        ...settingsState.paymentSettings,
        qris: !qrisChecked,
      },
    };
    dispatch(updateSettings({ data: newState, service: settingsService })).then(
      () =>
        dispatch(showSnackbar({ message: "Pengaturan QRIS telah diperbarui." }))
    );
  };

  const uploadQrisImg = (uri: string | undefined) => {
    const newState: UpdateCombinedSettingsData = {
      ...settingsState,
      paymentSettings: {
        ...settingsState.paymentSettings,
        qris: uri ? true : false,
        qrisImgUri: uri,
      },
    };
    dispatch(updateSettings({ data: newState, service: settingsService })).then(
      () => {
        hideUploadQrisDialog();
        dispatch(
          showSnackbar({ message: "Pengaturan QRIS telah diperbarui." })
        );
      }
    );
  };

  return (
    <View style={styles(theme).container}>
      <UploadQrisDialog
        visible={uploadQrisDialog}
        onDismiss={hideUploadQrisDialog}
        onSave={uploadQrisImg}
        imgUri={settingsState.paymentSettings.qrisImgUri}
      />
      <ShowQrisImageDialog
        visible={qrisImage}
        onDismiss={hideQrisImage}
        uri={settingsState.paymentSettings.qrisImgUri}
        theme={theme}
      />
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
              <Checkbox
                {...props}
                status={
                  settingsState.paymentSettings.cash ? "checked" : "unchecked"
                }
                disabled
              />
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
                status={
                  settingsState.paymentSettings.qris ? "checked" : "unchecked"
                }
                color={theme.colors.primary}
                onPress={toggleQris}
                disabled={!settingsState.paymentSettings.qrisImgUri}
              />
            </View>
          )}
          right={(props) =>
            settingsState.paymentSettings.qrisImgUri ? (
              <Row>
                <Button mode="text" {...props} onPress={showQrisImage}>
                  Lihat QRIS
                </Button>
                <Button
                  mode="outlined"
                  {...props}
                  onPress={showUploadQrisDialog}
                >
                  Ubah QRIS
                </Button>
              </Row>
            ) : (
              <Button mode="outlined" {...props} onPress={showUploadQrisDialog}>
                Unggah QRIS
              </Button>
            )
          }
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
    qrisImg: {
      alignSelf: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
  });
