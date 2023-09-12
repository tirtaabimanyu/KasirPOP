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
  TouchableRipple,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toRupiah } from "../utils/currencyUtils";

interface CashierItemProps {
  itemData: CashierItemData;
  cartQuantity: number;
  onPressDecrease: () => void;
  onPressIncrease: () => void;
  style?: StyleProp<ViewStyle>;
}

const CashierItem = (props: CashierItemProps) => {
  const theme = useTheme();
  const itemAcronym = props.itemData.name.match(/\b(\w)/g)?.join("") || "?";
  const stockIsEmpty = props.itemData.stock > 0;

  let stockDisplay = stockIsEmpty
    ? props.itemData.stock.toString()
    : "STOK HABIS";
  stockDisplay = props.itemData.isAlwaysInStock ? "Selalu Ada" : stockDisplay;

  const increaseDisabled =
    props.itemData.isAlwaysInStock ||
    props.cartQuantity == props.itemData.stock;
  return (
    <Card mode="outlined" style={props.style}>
      <View style={styles(theme).container}>
        <View style={styles(theme).left}>
          {props.itemData.imgUri ? (
            <Avatar.Image size={40} source={props.itemData.imgUri} />
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
            <View
              style={{
                // paddingHorizontal: 16,
                // paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: 100,
              }}
            >
              <TouchableRipple
                style={{
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                rippleColor={theme.colors.primaryContainer}
                onPress={props.onPressDecrease}
                borderless
              >
                <MaterialCommunityIcons name="minus" size={22} />
              </TouchableRipple>
              <Text variant="labelLarge" style={{ marginHorizontal: 8 }}>
                {props.cartQuantity}
              </Text>
              <TouchableRipple
                style={{
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                rippleColor={theme.colors.primaryContainer}
                onPress={props.onPressIncrease}
                borderless
                disabled={increaseDisabled}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={22}
                  color={
                    increaseDisabled
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.onSurface
                  }
                />
              </TouchableRipple>
            </View>
          ) : (
            <IconButton
              mode="contained"
              icon={"plus"}
              size={24}
              onPress={props.onPressIncrease}
              style={{ margin: 0 }}
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
