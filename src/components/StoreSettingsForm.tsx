import { StyleSheet, View } from "react-native";
import { Card, MD3Theme, Text, TextInput, useTheme } from "react-native-paper";
import InputImagePicker from "./InputImagePicker";
import { StoreSettingsData } from "../types/data";
import { useState } from "react";
import { SaveFormat } from "expo-image-manipulator";

type ErrorsType = { [key in keyof StoreSettingsData]: string[] };

type StoreSettingsFormProps = {
  title?: string;
  storeSettings?: StoreSettingsData;
  errors: ErrorsType;
  setStoreSettings: React.Dispatch<React.SetStateAction<StoreSettingsData>>;
};

const StoreSettingsForm = ({
  title,
  storeSettings,
  setStoreSettings,
  errors,
}: StoreSettingsFormProps) => {
  const theme = useTheme();
  const initialIsDirty = {
    name: false,
    logoImgUri: false,
    address: false,
    phoneNumber: false,
  };
  const [isDirty, setIsDirty] = useState(initialIsDirty);

  return (
    <Card
      mode="outlined"
      style={styles(theme).formCard}
      contentStyle={styles(theme).formCardContent}
    >
      {title && (
        <Text variant="titleLarge" style={styles(theme).formItem}>
          {title}
        </Text>
      )}
      <View style={styles(theme).formItem}>
        <Text variant="bodySmall" style={styles(theme).label}>
          Logo Toko (Opsional)
        </Text>
        <InputImagePicker
          imgUri={storeSettings?.logoImgUri}
          onRemoveImage={() =>
            setStoreSettings((state) => ({
              ...state,
              logoImgUri: null,
            }))
          }
          onSelectImage={(uri) => {
            setIsDirty((state) => ({ ...state, logoImgUri: true }));
            setStoreSettings((state) => ({ ...state, logoImgUri: uri }));
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
          value={storeSettings?.name || ""}
          onChangeText={(value) => {
            setIsDirty((state) => ({ ...state, name: true }));
            setStoreSettings((state) => ({ ...state, name: value }));
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
          value={storeSettings?.address || ""}
          onChangeText={(value) => {
            setIsDirty((state) => ({ ...state, address: true }));
            setStoreSettings((state) => ({ ...state, address: value }));
          }}
          style={styles(theme).transparent}
        />
      </View>
      <View>
        <TextInput
          label={"No. Telepon Toko (Opsional)"}
          mode="outlined"
          value={storeSettings?.phoneNumber || ""}
          onChangeText={(value) => {
            setIsDirty((state) => ({ ...state, phoneNumber: true }));
            setStoreSettings((state) => ({
              ...state,
              phoneNumber: value,
            }));
          }}
          style={styles(theme).transparent}
        />
      </View>
    </Card>
  );
};

export default StoreSettingsForm;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
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
