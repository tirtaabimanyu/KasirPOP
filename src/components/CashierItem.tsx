import {
  StyleProp,
  StyleSheet,
  StyleSheetProperties,
  View,
  ViewStyle,
} from "react-native";
import {
  Avatar,
  Card,
  useTheme,
  IconButton,
  MD3Theme,
  Text,
} from "react-native-paper";

interface CashierItemProps {
  itemData: any;
  style: StyleProp<ViewStyle>;
}

const CashierItem = (props: CashierItemProps) => {
  const theme = useTheme();
  return (
    <Card mode="outlined" style={props.style}>
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
          <IconButton mode="contained" icon={"plus"} size={24} />
        </View>
      </View>
    </Card>
  );
};

export default CashierItem;

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
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 8,
    },
  });
