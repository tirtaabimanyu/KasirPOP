import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  Avatar,
  Card,
  useTheme,
  IconButton,
  MD3Theme,
  Text,
  Button,
} from "react-native-paper";
import { toRupiah } from "../utils/formatUtils";
import InputCounter from "./InputCounter";
import useDialog from "../hooks/useDialog";
import UpdateStockDialog from "./UpdateStockDialog";
import { useState } from "react";
import { ProductData, ProductStockData } from "../types/data";

type CommonProps = {
  itemData: ProductData;
  cartQuantity: number;
  onPressDecrease: () => void;
  onPressIncrease: () => void;
  onPressSaveUpdateStock?: (data: ProductStockData) => void;
  style?: StyleProp<ViewStyle>;
};

interface EditableProps extends CommonProps {
  editable: true;
  onChangeText: (value: number) => void;
}

interface NonEditableProps extends CommonProps {
  editable?: false;
}

type CashierItemProps = EditableProps | NonEditableProps;

const CashierItem = (props: CashierItemProps) => {
  const theme = useTheme();
  const itemAcronym = props.itemData.name.match(/\b(\w)/g)?.join("") || "?";

  const isInStock = props.itemData.isAlwaysInStock || props.itemData.stock > 0;
  let stockDisplay = isInStock ? props.itemData.stock.toString() : "STOK HABIS";
  stockDisplay = props.itemData.isAlwaysInStock ? "Selalu Ada" : stockDisplay;

  const increaseDisabled =
    !props.itemData.isAlwaysInStock &&
    props.cartQuantity == props.itemData.stock;

  const [updateStockDialog, showUpdateStockDialog, hideUpdateStockDialog] =
    useDialog();

  const onSaveStock = (data: { isAlwaysInStock: boolean; stock: number }) => {
    hideUpdateStockDialog();
    props.onPressSaveUpdateStock && props.onPressSaveUpdateStock(data);
  };

  const [isEditing, setIsEditing] = useState(false);

  const onChangeText = (value: number) => {
    value = props.itemData.isAlwaysInStock
      ? value
      : Math.min(value, props.itemData.stock);
    props.editable && props.onChangeText(value);
  };

  const actionButton = isInStock ? (
    props.cartQuantity > 0 || isEditing ? (
      <InputCounter
        value={props.cartQuantity}
        onPressDecrease={props.onPressDecrease}
        onPressIncrease={props.onPressIncrease}
        disableDecrement={props.cartQuantity <= 0}
        disableIncrement={increaseDisabled}
        setIsEditing={setIsEditing}
        {...(props.editable
          ? {
              editable: props.editable,
              onChangeText: onChangeText,
            }
          : { editable: props.editable })}
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
    )
  ) : (
    <Button mode={"contained-tonal"} onPress={showUpdateStockDialog}>
      Ubah Stok
    </Button>
  );
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
      <UpdateStockDialog
        productData={props.itemData}
        visible={updateStockDialog}
        onSave={onSaveStock}
        onCancel={hideUpdateStockDialog}
      />
      <View style={styles(theme).container}>
        <View style={styles(theme).left}>
          {props.itemData.imgUri ? (
            <Avatar.Image size={40} source={{ uri: props.itemData.imgUri }} />
          ) : (
            <Avatar.Text label={itemAcronym} size={40} />
          )}
        </View>
        <View style={styles(theme).content}>
          <Text
            variant="titleMedium"
            style={[{ marginBottom: 4 }, !isInStock && styles(theme).disabled]}
          >
            {props.itemData.name}
          </Text>
          <Text
            variant="bodyMedium"
            style={[!isInStock && styles(theme).disabled]}
          >
            {`${stockDisplay} • ${toRupiah(props.itemData.price)}`}
          </Text>
        </View>
        <View style={styles(theme).right}>{actionButton}</View>
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
    disabled: {
      color: theme.colors.onSurfaceDisabled,
    },
  });
