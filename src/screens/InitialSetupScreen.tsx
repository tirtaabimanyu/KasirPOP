import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Card,
  Checkbox,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import StoreSettingsForm from "../components/StoreSettingsForm";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { useDatabaseConnection } from "../data/connection";
import { useEffect, useState } from "react";
import { StoreSettingsData, UpdateCombinedSettingsData } from "../types/data";
import { Image, View } from "react-native";
import QrisListItem from "../components/QrisListItem";
import { updateSettings } from "../redux/slices/settingsSlice";
import { showSnackbar } from "../redux/slices/layoutSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/routes";

const InitialSetupScreen = (
  props: NativeStackScreenProps<RootStackParamList, "initialSetup">
) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settingsService } = useDatabaseConnection();
  const { storeSettings, paymentSettings } = useAppSelector(
    (state) => state.settings
  );

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

  const toggleQris = () => {
    const qrisChecked = paymentSettings.qris;
    const newState: UpdateCombinedSettingsData = {
      paymentSettings: {
        qris: !qrisChecked,
      },
    };
    dispatch(updateSettings({ data: newState, service: settingsService })).then(
      () =>
        dispatch(showSnackbar({ message: "Pengaturan QRIS telah diperbarui." }))
    );
  };

  const uploadQrisImg = (uri?: string) => {
    const newState: UpdateCombinedSettingsData = {
      paymentSettings: {
        qris: uri ? true : false,
        qrisImgUri: uri,
      },
    };
    dispatch(updateSettings({ data: newState, service: settingsService })).then(
      () => {
        dispatch(
          showSnackbar({ message: "Pengaturan QRIS telah diperbarui." })
        );
      }
    );
  };

  const onPressSave = () => {
    dispatch(
      updateSettings({
        data: { storeSettings: newStoreSettings },
        service: settingsService,
      })
    ).then(() => {
      dispatch(showSnackbar({ message: "Informasi toko telah diperbarui." }));
      props.navigation.replace("home", { screen: "cashier" });
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 32 }}
    >
      <StoreSettingsForm
        title={"Informasi Toko"}
        storeSettings={newStoreSettings}
        setStoreSettings={setNewStoreSettings}
        errors={errors}
      />
      <Card
        mode="outlined"
        style={{
          backgroundColor: "white",
          borderColor: theme.colors.outlineVariant,
          marginBottom: 24,
        }}
        contentStyle={{ padding: 24 }}
      >
        <Text variant="titleLarge" style={{ marginBottom: 24 }}>
          Metode Pembayaran
        </Text>
        <List.Item
          title="Uang Tunai"
          left={(props) => (
            <View style={{ justifyContent: "center" }}>
              <Checkbox
                {...props}
                status={paymentSettings.cash ? "checked" : "unchecked"}
                disabled
              />
            </View>
          )}
        />
        <QrisListItem
          paymentSettings={paymentSettings}
          onPressToggle={toggleQris}
          onPressUpload={uploadQrisImg}
        />
      </Card>
      <Button
        mode="contained"
        style={{ alignSelf: "flex-end" }}
        onPress={onPressSave}
        disabled={!canSubmit}
      >
        Simpan Pengaturan Toko
      </Button>
    </ScrollView>
  );
};

export default InitialSetupScreen;
