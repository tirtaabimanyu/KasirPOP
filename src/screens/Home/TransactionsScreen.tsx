import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Button,
  Card,
  Chip,
  MD3Theme,
  Text,
  useTheme,
} from "react-native-paper";
import InputDatePicker from "../../components/InputDatePicker";
import TransactionsItem from "../../components/TransactionsItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BaseDialog from "../../components/BaseDialog";
import { HomeDrawerParamList, RootStackParamList } from "../../types/routes";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStore";
import { toRupiah } from "../../utils/currencyUtils";
import useDialog from "../../hooks/useDialog";
import { fetchTransactions } from "../../redux/slices/transactionSlice";
import { useDatabaseConnection } from "../../data/connection";

type DateRange = {
  start: Date;
  end: Date;
};

type PaymentType = "all" | "cash" | "qris";
const paymentTypeChip: { value: PaymentType; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "cash", label: "Uang Tunai" },
  { value: "qris", label: "QRIS" },
];

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

const DownloadDialog = (props: {
  visible: boolean;
  onDismiss: () => void;
  onDownload: (dateRange: { start: Date; end: Date }) => void;
}) => {
  const [downloadDateRange, setDownloadDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    end: new Date(),
  });

  return (
    <BaseDialog
      visible={props.visible}
      onDismiss={props.onDismiss}
      dismissable={true}
    >
      <BaseDialog.Title>Unduh Laporan Transaksi</BaseDialog.Title>
      <BaseDialog.Content>
        <InputDatePicker
          label="Dari Tanggal"
          date={downloadDateRange.start}
          setDate={(value) =>
            setDownloadDateRange((state) => ({ ...state, startDate: value }))
          }
          style={{ marginBottom: 16 }}
        />
        <InputDatePicker
          label="Sampai Tanggal"
          date={downloadDateRange.end}
          setDate={(value) =>
            setDownloadDateRange((state) => ({ ...state, endDate: value }))
          }
        />
      </BaseDialog.Content>
      <BaseDialog.Actions>
        <Button onPress={props.onDismiss} style={{ paddingHorizontal: 16 }}>
          Batal
        </Button>
        <Button
          mode="contained"
          onPress={() =>
            props.onDownload({
              start: downloadDateRange.start,
              end: downloadDateRange.end,
            })
          }
          style={{ paddingHorizontal: 24 }}
        >
          Unduh
        </Button>
      </BaseDialog.Actions>
    </BaseDialog>
  );
};

const TransactionsScreen = ({
  navigation,
  route,
}: CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, "transactions">,
  NativeStackScreenProps<RootStackParamList, "home">
>) => {
  const theme = useTheme();
  const { transactionRepository } = useDatabaseConnection();
  const { summary, transactions } = useAppSelector(
    (state) => state.transaction
  );
  const dispatch = useAppDispatch();

  const [downloadDialog, showDownloadDialog, hideDownloadDialog] = useDialog();
  const [transactionsDateRange, setTransactionsDateRange] = useState<DateRange>(
    {
      start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      end: new Date(),
    }
  );
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType>("all");

  useFocusEffect(
    useCallback(() => {
      dispatch(
        fetchTransactions({
          dateRange: transactionsDateRange,
          repository: transactionRepository,
        })
      );
    }, [dispatch])
  );

  return (
    <View style={styles(theme).container}>
      <DownloadDialog
        visible={downloadDialog}
        onDismiss={hideDownloadDialog}
        onDownload={() => {
          hideDownloadDialog();
        }}
      />
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
            onPress={showDownloadDialog}
          >
            Unduh Laporan
          </Button>
        )}
      />
      <View style={styles(theme).summaryContainer}>
        <Card
          mode="outlined"
          style={{
            flex: 1,
            marginRight: 12,
            backgroundColor: "white",
            borderColor: theme.colors.outlineVariant,
          }}
          contentStyle={{
            flex: 1,
            padding: 16,
            justifyContent: "space-between",
          }}
        >
          <Text variant="headlineMedium">
            {toRupiah(summary.cash + summary.qris)}
          </Text>
          <Text variant="bodyMedium">Total Transaksi Hari Ini</Text>
        </Card>
        <View style={{ flex: 1 }}>
          <Card
            mode="outlined"
            style={{
              marginBottom: 12,
              backgroundColor: "white",
              borderColor: theme.colors.outlineVariant,
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
            <Text variant="titleMedium">{toRupiah(summary.cash)}</Text>
          </Card>
          <Card
            mode="outlined"
            style={{
              backgroundColor: "white",
              borderColor: theme.colors.outlineVariant,
            }}
            contentStyle={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="bodySmall">QRIS</Text>
            <Text variant="titleMedium">{toRupiah(summary.qris)}</Text>
          </Card>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <View>
          <Text variant="bodySmall" style={{ marginBottom: 8 }}>
            Jenis Pembayaran
          </Text>
          <View style={{ flexDirection: "row" }}>
            {paymentTypeChip.map((paymentType) => {
              const isSelected = selectedPaymentType == paymentType.value;
              return (
                <Chip
                  key={`chip-${paymentType.value}`}
                  mode="outlined"
                  style={[
                    { marginRight: 8 },
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                  selected={isSelected}
                  onPress={() => setSelectedPaymentType(paymentType.value)}
                >
                  {paymentType.label}
                </Chip>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <InputDatePicker
            label="Dari Tanggal"
            date={transactionsDateRange.start}
            setDate={(value) =>
              setTransactionsDateRange((state) => ({ ...state, start: value }))
            }
            style={{ minWidth: 150, marginRight: 16 }}
          />
          <InputDatePicker
            label="Sampai Tanggal"
            date={transactionsDateRange.end}
            setDate={(value) =>
              setTransactionsDateRange((state) => ({ ...state, end: value }))
            }
            style={{ minWidth: 150 }}
          />
        </View>
      </View>
      <FlatList
        renderItem={(item) => <TransactionsItem itemData={item} />}
        ItemSeparatorComponent={RowSeparator}
        data={transactions}
        showsVerticalScrollIndicator={false}
      />
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
