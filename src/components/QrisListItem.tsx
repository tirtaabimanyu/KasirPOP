import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Button, Checkbox, List, MD3Theme, useTheme } from "react-native-paper";
import Row from "./Row";
import { PaymentSettingsData } from "../types/data";
import BaseDialog from "./BaseDialog";
import InputImagePicker from "./InputImagePicker";
import useDialog from "../hooks/useDialog";
import { useState } from "react";

const ShowQrisImageDialog = ({
  visible,
  onDismiss,
  uri,
  theme,
}: {
  visible: boolean;
  onDismiss: () => void;
  uri?: string;
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

type QrisListItemProps = {
  paymentSettings: PaymentSettingsData;
  onPressToggle: () => void;
  onPressUpload: (uri?: string) => void;
};

const QrisListItem = ({
  paymentSettings,
  onPressToggle,
  onPressUpload,
}: QrisListItemProps) => {
  const theme = useTheme();
  const [uploadQrisDialog, showUploadQrisDialog, hideUploadQrisDialog] =
    useDialog();

  const [qrisImage, showQrisImage, hideQrisImage] = useDialog();

  const onSave = (uri?: string) => {
    hideUploadQrisDialog();
    onPressUpload(uri);
  };

  return (
    <>
      <UploadQrisDialog
        visible={uploadQrisDialog}
        onDismiss={hideUploadQrisDialog}
        onSave={onSave}
        imgUri={paymentSettings.qrisImgUri}
      />
      <ShowQrisImageDialog
        visible={qrisImage}
        onDismiss={hideQrisImage}
        uri={paymentSettings.qrisImgUri}
        theme={theme}
      />
      <List.Item
        title="QRIS"
        left={(props) => (
          <View style={{ justifyContent: "center" }}>
            <Checkbox
              {...props}
              status={paymentSettings.qris ? "checked" : "unchecked"}
              color={theme.colors.primary}
              onPress={onPressToggle}
              disabled={!paymentSettings.qrisImgUri}
            />
          </View>
        )}
        right={(props) =>
          paymentSettings.qrisImgUri ? (
            <Row>
              <Button mode="text" {...props} onPress={showQrisImage}>
                Lihat QRIS
              </Button>
              <Button mode="outlined" {...props} onPress={showUploadQrisDialog}>
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
    </>
  );
};

export default QrisListItem;

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
