import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, Card, MD3Theme, Text, useTheme } from "react-native-paper";
import InputDatePicker from "../../components/InputDatePicker";
import TransactionsItem from "../../components/TransactionsItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BaseDialog from "../../components/BaseDialog";

const Tab = createMaterialTopTabNavigator();

const RowSeparator = () => <View style={{ height: 24 }} />;
const Screen1 = () => (
  <FlatList
    contentContainerStyle={{ paddingVertical: 24 }}
    renderItem={() => <TransactionsItem itemData={{}} />}
    ItemSeparatorComponent={RowSeparator}
    data={[1, 2, 3]}
    showsVerticalScrollIndicator={false}
  />
);

const TransactionsScreen = ({
  navigation,
  route,
}: CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, "transactions">,
  NativeStackScreenProps<RootStackParamList, "home">
>) => {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({ startDate: new Date(), endDate: new Date() });

  return (
    <View style={styles(theme).container}>
      <BaseDialog visible={visible} onDismiss={hideDialog} dismissable={true}>
        <BaseDialog.Title>Unduh Laporan Transaksi</BaseDialog.Title>
        <BaseDialog.Content>
          <InputDatePicker
            label="Dari Tanggal"
            date={dateRange.startDate}
            setDate={(d: Date) => setDateRange({ ...dateRange, startDate: d })}
            style={{ marginBottom: 16 }}
          />
          <InputDatePicker
            label="Sampai Tanggal"
            date={dateRange.endDate}
            setDate={(d: Date) => setDateRange({ ...dateRange, endDate: d })}
          />
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={hideDialog} style={{ paddingHorizontal: 16 }}>
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={hideDialog}
            style={{ paddingHorizontal: 24 }}
          >
            Unduh
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <Card.Title
        title="Riwayat Transaksi"
        titleVariant="headlineLarge"
        style={{
          paddingLeft: 0,
          minHeight: 0,
          marginBottom: 24,
        }}
        right={() => (
          <Button
            mode="contained"
            icon={"tray-arrow-down"}
            onPress={showDialog}
          >
            Unduh Laporan
          </Button>
        )}
      />
      <View style={styles(theme).summaryContainer}>
        <Card
          mode="outlined"
          style={{ flex: 1, marginRight: 12 }}
          contentStyle={{
            flex: 1,
            padding: 16,
            justifyContent: "space-between",
          }}
        >
          <Text variant="headlineMedium">Rp500,000</Text>
          <Text variant="bodyMedium">Total Transaksi Hari Ini</Text>
        </Card>
        <View style={{ flex: 1 }}>
          <Card
            mode="outlined"
            style={{
              marginBottom: 12,
            }}
            contentStyle={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="bodySmall">Uang Tunai</Text>
            <Text variant="titleMedium">Rp450,000</Text>
          </Card>
          <Card
            mode="outlined"
            contentStyle={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="bodySmall">QRIS</Text>
            <Text variant="titleMedium">Rp50,000</Text>
          </Card>
        </View>
      </View>
      <Tab.Navigator
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: theme.colors.surface },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Tab.Screen name="Semua" component={Screen1} />
        <Tab.Screen name="Uang Tunai" component={Screen1} />
        <Tab.Screen name="QRIS" component={Screen1} />
      </Tab.Navigator>
    </View>
  );
};

export default TransactionsScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
      paddingTop: 16,
      width: "100%",
    },
    summaryContainer: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 24,
    },
  });
