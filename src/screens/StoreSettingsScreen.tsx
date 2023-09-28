import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Card,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import InputImagePicker from "../components/InputImagePicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/routes";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { useEffect, useState } from "react";
import { updateSettings } from "../redux/slices/settingsSlice";
import { useDatabaseConnection } from "../data/connection";
import { showSnackbar } from "../redux/slices/layoutSlice";
import { StoreSettingsData } from "../types/data";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";
import { SaveFormat } from "expo-image-manipulator";

const StoreSettingsScreen = (
  props: NativeStackScreenProps<RootStackParamList, "storeSettings">
) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settingsService } = useDatabaseConnection();
  const { storeSettings } = useAppSelector((state) => state.settings);

  const [newStoreSettings, setNewStoreSettings] = useState(storeSettings);

  const hasUnsavedChanges =
    JSON.stringify(storeSettings) !== JSON.stringify(newStoreSettings);

  const initialIsDirty = {
    name: false,
    logoImgUri: false,
    address: false,
    phoneNumber: false,
  };
  const [isDirty, setIsDirty] = useState(initialIsDirty);

  const initialErrors: { [key in keyof StoreSettingsData]: string[] } = {
    name: [],
    logoImgUri: [],
    address: [],
    phoneNumber: [],
  };
  const [errors, setErrors] = useState(initialErrors);
  const canSubmit = JSON.stringify(initialErrors) == JSON.stringify(errors);

  const onPressSave = () => {
    dispatch(
      updateSettings({
        data: { storeSettings: newStoreSettings },
        service: settingsService,
      })
    ).then(() => {
      setCanNavigate(true);
      dispatch(showSnackbar({ message: "Informasi toko telah diperbarui." }));
      props.navigation.canGoBack()
        ? props.navigation.goBack()
        : props.navigation.replace("home", { screen: "cashier" });
    });
  };

  const validation = () => {
    const newErrors = initialErrors;
    if (newStoreSettings?.name.length == 0) {
      newErrors["name"].push("Nama toko tidak boleh kosong");
    }
    setErrors(newErrors);
  };

  useEffect(validation, [newStoreSettings, hasUnsavedChanges]);

  const [canNavigate, setCanNavigate] = useState(false);
  const [backAlert, showBackAlert, hideBackAlert] = useDialog();
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("beforeRemove", (e) => {
      if (!hasUnsavedChanges || backAlert || canNavigate) {
        return;
      }
      e.preventDefault();
      showBackAlert();
    });
    return unsubscribe;
  }, [
    props.navigation,
    hasUnsavedChanges,
    backAlert,
    showBackAlert,
    canNavigate,
  ]);

  return (
    <ScrollView
      style={styles(theme).container}
      contentContainerStyle={{ paddingBottom: 24 }}
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
            onPress={() => props.navigation.goBack()}
            style={{ paddingHorizontal: 24 }}
          >
            Keluar Halaman
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <Card
        mode="outlined"
        style={styles(theme).formCard}
        contentStyle={styles(theme).formCardContent}
      >
        <View style={styles(theme).formItem}>
          <Text variant="bodySmall" style={styles(theme).label}>
            Logo Toko (Opsional)
          </Text>
          <InputImagePicker
            imgUri={newStoreSettings?.logoImgUri}
            onRemoveImage={() =>
              setNewStoreSettings((state) => ({
                ...state,
                logoImgUri: undefined,
              }))
            }
            onSelectImage={(uri) => {
              setIsDirty((state) => ({ ...state, logoImgUri: true }));
              setNewStoreSettings((state) => ({ ...state, logoImgUri: uri }));
            }}
            resize={{ width: 100, height: 100 }}
            base64
            saveFormat={SaveFormat.PNG}
          />
        </View>
        <View style={styles(theme).formItem}>
          <TextInput
            label={"Nama Toko"}
            mode="outlined"
            value={newStoreSettings?.name || ""}
            onChangeText={(value) => {
              setIsDirty((state) => ({ ...state, name: true }));
              setNewStoreSettings((state) => ({ ...state, name: value }));
            }}
            style={styles(theme).transparent}
            error={isDirty["name"] && errors["name"].length > 0}
          />
          {isDirty["name"] &&
            errors["name"].map((value, idx) => (
              <Text
                key={`error-name-${idx}`}
                style={{ color: theme.colors.error, marginTop: 4 }}
              >
                {value}
              </Text>
            ))}
        </View>
        <View style={styles(theme).formItem}>
          <TextInput
            label={"Alamat Toko (Opsional)"}
            mode="outlined"
            value={newStoreSettings?.address || ""}
            onChangeText={(value) => {
              setIsDirty((state) => ({ ...state, address: true }));
              setNewStoreSettings((state) => ({ ...state, address: value }));
            }}
            style={styles(theme).transparent}
          />
        </View>
        <View style={styles(theme).formItem}>
          <TextInput
            label={"No. Telepon Toko (Opsional)"}
            mode="outlined"
            value={newStoreSettings?.phoneNumber || ""}
            onChangeText={(value) => {
              setIsDirty((state) => ({ ...state, phoneNumber: true }));
              setNewStoreSettings((state) => ({
                ...state,
                phoneNumber: value,
              }));
            }}
            style={styles(theme).transparent}
          />
        </View>
      </Card>
      <Button
        mode="contained"
        style={styles(theme).saveButton}
        onPress={onPressSave}
        disabled={!canSubmit}
      >
        Simpan
      </Button>
    </ScrollView>
  );
};

export default StoreSettingsScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
    },
    saveButton: {
      alignSelf: "flex-end",
    },
    formCard: {
      marginBottom: 24,
      backgroundColor: "white",
      borderColor: theme.colors.outlineVariant,
    },
    formCardContent: { padding: 24 },
    divider: {
      width: 1,
      height: "100%",
      marginLeft: 32,
      marginRight: 40,
    },
    formItem: { marginBottom: 24 },
    transparent: { backgroundColor: "transparent" },
    row: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: { marginBottom: 8 },
  });
