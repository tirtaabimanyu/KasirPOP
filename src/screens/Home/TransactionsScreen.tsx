import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
import { toRupiah } from "../../utils/formatUtils";
import useDialog from "../../hooks/useDialog";
import {
  fetchTransactionSummary,
  fetchTransactions,
} from "../../redux/slices/transactionSlice";
import { useDatabaseConnection } from "../../data/connection";
import { PaymentType, TransactionData } from "../../types/data";
import useDateRange from "../../hooks/useDateRange";

type TransactionPaymentType = PaymentType | "all";
const paymentTypeChip: { value: TransactionPaymentType; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: PaymentType.CASH, label: "Uang Tunai" },
  { value: PaymentType.QRIS, label: "QRIS" },
];

const RowSeparator = () => <View style={{ height: 24 }} />;

const DownloadDialog = (props: {
  visible: boolean;
  onDismiss: () => void;
  onDownload: (dateRange: { start: Date; end: Date }) => void;
}) => {
  const todayDate = new Date().toDateString();
  const [downloadDateRange, setDownloadDateStart, setDownloadDateEnd] =
    useDateRange();

  useEffect(() => {
    // Set report range to 1 week ago - today
    setDownloadDateStart(
      new Date(Number(new Date(todayDate)) - 1000 * 60 * 60 * 24 * 7)
    );
    setDownloadDateEnd(new Date(todayDate));
  }, [todayDate]);

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
          setDate={setDownloadDateStart}
          style={{ marginBottom: 16 }}
        />
        <InputDatePicker
          label="Sampai Tanggal"
          date={downloadDateRange.end}
          setDate={setDownloadDateEnd}
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
  const isScreenFocused = useIsFocused();
  const { transactionService } = useDatabaseConnection();
  const dispatch = useAppDispatch();
  const { summary, transactions } = useAppSelector(
    (state) => state.transaction
  );
  const cashTransactions = transactions.filter(
    (transaction) => transaction.paymentType == PaymentType.CASH
  );
  const qrisTransactions = transactions.filter(
    (transaction) => transaction.paymentType == PaymentType.QRIS
  );

  const [downloadDialog, showDownloadDialog, hideDownloadDialog] = useDialog();
  const todayDate = new Date().toDateString();
  const [
    transactionsDateRange,
    setTransactionsDateStart,
    setTransactionsDateEnd,
  ] = useDateRange();
  const [summaryDateRange, setSummaryDateStart, setSummaryDateEnd] =
    useDateRange();

  const [selectedPaymentType, setSelectedPaymentType] =
    useState<TransactionPaymentType>("all");

  const flatListData =
    selectedPaymentType == "all"
      ? transactions
      : selectedPaymentType == PaymentType.CASH
      ? cashTransactions
      : qrisTransactions;

  const groupedFlatListData = flatListData.reduce((obj, data) => {
    const date = new Date(data.createdAt).toDateString();
    if (Object.keys(obj).includes(date)) {
      obj[date].transactions.push(data);
      obj[date].totalPrice += data.totalPrice;
    } else {
      obj[date] = {
        createdAt: date,
        totalPrice: data.totalPrice,
        transactions: [data],
      };
    }
    return obj;
  }, {} as { [key: string]: { createdAt: string; totalPrice: number; transactions: TransactionData[] } });

  useEffect(() => {
    // Set summary to today
    setSummaryDateStart(new Date(todayDate));
    setSummaryDateEnd(new Date(todayDate));

    // Set transactions to 1 week ago - today
    setTransactionsDateStart(
      new Date(Number(new Date(todayDate)) - 1000 * 60 * 60 * 24 * 7)
    );
    setTransactionsDateEnd(new Date(todayDate));
  }, [todayDate]);

  useEffect(() => {
    dispatch(
      fetchTransactionSummary({
        dateRange: summaryDateRange,
        service: transactionService,
      })
    );
    dispatch(
      fetchTransactions({
        dateRange: transactionsDateRange,
        service: transactionService,
      })
    );
  }, [isScreenFocused, summaryDateRange, transactionsDateRange]);

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
            setDate={setTransactionsDateStart}
            style={{ minWidth: 150, marginRight: 16 }}
          />
          <InputDatePicker
            label="Sampai Tanggal"
            date={transactionsDateRange.end}
            setDate={setTransactionsDateEnd}
            style={{ minWidth: 150 }}
          />
        </View>
      </View>
      <FlatList
        renderItem={({ item }) => <TransactionsItem itemData={item} />}
        ItemSeparatorComponent={RowSeparator}
        data={Object.values(groupedFlatListData)}
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
