import { Card, Divider, List, Text, useTheme } from "react-native-paper";
import { TransactionData } from "../types/data";
import {
  toFormattedDate,
  toFormattedTime,
  toRupiah,
} from "../utils/formatUtils";
import { View } from "react-native";

interface TransactionsItemProps {
  itemData: { createdAt: string; transactions: TransactionData[] };
}

const TransactionsItem = ({ itemData }: TransactionsItemProps) => {
  const theme = useTheme();
  return (
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
        justifyContent: "space-between",
      }}
    >
      <List.Accordion
        title={
          <Text variant="titleMedium">
            {toFormattedDate(new Date(itemData.createdAt), true)}
          </Text>
        }
        style={{ backgroundColor: "white" }}
      >
        {itemData.transactions.map((transaction) => {
          return (
            <View key={`divider-transaction-${transaction.id}`}>
              <Divider horizontalInset={true} />
              <List.Item
                title={
                  <Text variant="bodyLarge">{`Order #${transaction.id}`}</Text>
                }
                description={
                  <Text variant="labelSmall">{`${toFormattedDate(
                    new Date(transaction.createdAt),
                    true
                  )}, ${toFormattedTime(
                    new Date(transaction.createdAt)
                  )}`}</Text>
                }
                right={(props) => (
                  <Text variant="labelLarge" {...props}>
                    {`${toRupiah(transaction.totalPrice)}`}
                  </Text>
                )}
                style={{ marginLeft: 8 }}
              />
            </View>
          );
        })}
      </List.Accordion>
    </Card>
  );
};

export default TransactionsItem;
