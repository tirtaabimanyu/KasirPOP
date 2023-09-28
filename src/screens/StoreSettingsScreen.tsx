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
import StoreSettingsForm from "../components/StoreSettingsForm";

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

  const initialErrors: { [key in keyof StoreSettingsData]: string[] } = {
    name: [],
    logoImgUri: [],
    address: [],
    phoneNumber: [],
  };
  const [errors, setErrors] = useState(initialErrors);
  const [canSubmit, setCanSubmit] = useState(false);
  const [canNavigate, setCanNavigate] = useState(false);

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
    let canSubmit = true;
    if (
      newStoreSettings?.name == undefined ||
      newStoreSettings.name.length == 0
    ) {
      canSubmit = false;
      newErrors["name"].push("Nama toko tidak boleh kosong");
    }
    setErrors(newErrors);
    setCanSubmit(canSubmit);
  };

  useEffect(validation, [newStoreSettings, hasUnsavedChanges]);

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
      <StoreSettingsForm
        storeSettings={newStoreSettings}
        setStoreSettings={setNewStoreSettings}
        errors={errors}
      />
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
