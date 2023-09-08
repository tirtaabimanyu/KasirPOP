import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  useTheme,
  IconButton,
  MD3Theme,
  Text,
  Button,
} from "react-native-paper";

interface InventoryItemProps {
  itemData: any;
}

const InventoryItem = (props: InventoryItemProps) => {
  const theme = useTheme();
  return (
    <Card mode="outlined">
      <View style={styles(theme).container}>
        <View style={styles(theme).left}>
          <Avatar.Text label="QW" size={40} />
        </View>
        <View style={styles(theme).content}>
          <Text variant="titleMedium">Bakso Kasar</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ minWidth: 48 }}>
              <Text>Harga</Text>
            </View>
            <Text>: Rp50,000</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ minWidth: 48 }}>
              <Text>Stok</Text>
            </View>
            <Text>: Selalu Ada</Text>
          </View>
        </View>
        <View style={styles(theme).right}>
          <IconButton
            icon={"delete-outline"}
            size={24}
            style={{ marginRight: 8 }}
          />
          <Button mode="outlined" style={{ marginRight: 8 }}>
            Ubah Produk
          </Button>
          <Button mode="contained-tonal">Ubah Stok</Button>
        </View>
      </View>
    </Card>
  );
};

export default InventoryItem;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
    left: {
      justifyContent: "center",
      marginRight: 16,
    },
    content: {
      flex: 1,
      marginRight: 16,
    },
    right: {
      //   backgroundColor: "green",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });
