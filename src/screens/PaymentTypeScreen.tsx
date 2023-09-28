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
import QrisListItem from "../components/QrisListItem";

const PaymentTypeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "paymentType">) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settingsService } = useDatabaseConnection();
  const settingsState = useAppSelector((state) => state.settings);

  const toggleQris = () => {
    const qrisChecked = settingsState.paymentSettings.qris;
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

  return (
    <View style={styles(theme).container}>
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
        <QrisListItem
          paymentSettings={settingsState.paymentSettings}
          onPressToggle={toggleQris}
          onPressUpload={uploadQrisImg}
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
