import { Card, Divider, List, Text } from "react-native-paper";

interface TransactionsItemProps {
  itemData: any;
}

const TransactionsItem = (props: TransactionsItemProps) => {
  return (
    <Card
      mode="outlined"
      style={{ flex: 1, marginRight: 12 }}
      contentStyle={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <List.Accordion title={<Text variant="titleMedium">Hari Ini</Text>}>
        <Divider horizontalInset={true} />
        <List.Item
          title={<Text variant="bodyLarge">Order #2</Text>}
          description={<Text variant="labelSmall">Hari ini, 16:00 WIB</Text>}
          right={(props) => (
            <Text variant="labelLarge" {...props}>
              Rp50,000
            </Text>
          )}
          style={{ marginLeft: 8 }}
        />
        <Divider horizontalInset={true} />
        <List.Item
          title={<Text variant="bodyLarge">Order #1</Text>}
          description={<Text variant="labelSmall">Hari ini, 16:00 WIB</Text>}
          right={(props) => (
            <Text variant="labelLarge" {...props}>
              Rp50,000
            </Text>
          )}
          style={{ marginLeft: 8 }}
        />
      </List.Accordion>
    </Card>
  );
};

export default TransactionsItem;
