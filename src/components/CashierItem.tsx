import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  Avatar,
  Card,
  useTheme,
  IconButton,
  MD3Theme,
  Text,
} from "react-native-paper";
import { toRupiah } from "../utils/currencyUtils";
import InputCounter from "./InputCounter";

interface CashierItemProps {
  itemData: ProductData;
  cartQuantity: number;
  onPressDecrease: () => void;
  onPressIncrease: () => void;
  style?: StyleProp<ViewStyle>;
}

const CashierItem = (props: CashierItemProps) => {
  const theme = useTheme();
  const itemAcronym = props.itemData.name.match(/\b(\w)/g)?.join("") || "?";

  const isInStock = props.itemData.isAlwaysInStock || props.itemData.stock > 0;
  let stockDisplay = isInStock ? props.itemData.stock.toString() : "STOK HABIS";
  stockDisplay = props.itemData.isAlwaysInStock ? "Selalu Ada" : stockDisplay;

  const increaseDisabled =
    !props.itemData.isAlwaysInStock &&
    props.cartQuantity == props.itemData.stock;
  return (
    <Card
      mode="outlined"
      style={[
        {
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.onPrimary,
        },
        props.style,
      ]}
    >
      <View style={styles(theme).container}>
        <View style={styles(theme).left}>
          {props.itemData.imgUri ? (
            <Avatar.Image size={40} source={{ uri: props.itemData.imgUri }} />
          ) : (
            <Avatar.Text label={itemAcronym} size={40} />
          )}
        </View>
        <View style={styles(theme).content}>
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>
            {props.itemData.name}
          </Text>
          <Text variant="bodyMedium">
            {stockDisplay + " • " + toRupiah(props.itemData.price)}
          </Text>
        </View>
        <View style={styles(theme).right}>
          {props.cartQuantity > 0 ? (
            <InputCounter
              value={props.cartQuantity}
              onPressDecrease={props.onPressDecrease}
              onPressIncrease={props.onPressIncrease}
              disableDecrement={props.cartQuantity == 0}
              disableIncrement={props.cartQuantity == props.itemData.stock}
            />
          ) : (
            <IconButton
              mode="contained"
              icon={"plus"}
              size={24}
              onPress={props.onPressIncrease}
              style={{ margin: 0 }}
              containerColor={theme.colors.primary}
              iconColor="white"
              disabled={!isInStock}
            />
          )}
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
      alignItems: "center",
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
    },
  });
