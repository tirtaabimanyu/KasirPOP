import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  useTheme,
  MD3Theme,
  Text,
  Button,
  Chip,
  Switch,
} from "react-native-paper";
import { toRupiah } from "../utils/currencyUtils";
import { useState } from "react";
import BaseDialog from "./BaseDialog";
import InputCounter from "./InputCounter";

type UpdateStockDialogProp = {
  productData: ProductData;
  visible: boolean;
  onSave: (data: ProductStockData) => void;
  onCancel: () => void;
};

const UpdateStockDialog = ({
  productData,
  visible,
  onSave,
  onCancel,
}: UpdateStockDialogProp) => {
  const [isAlwaysInStock, setIsAlwaysInStock] = useState(
    productData.isAlwaysInStock
  );
  const [stock, setStock] = useState(productData.stock);
  return (
    <BaseDialog visible={visible}>
      <BaseDialog.Title>{`Ubah Stok ${productData.name}`}</BaseDialog.Title>
      <BaseDialog.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>Stok Selalu Ada</Text>
          <Switch
            value={isAlwaysInStock}
            onValueChange={() => setIsAlwaysInStock((state) => !state)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>Jumlah Stok</Text>
          <InputCounter
            value={stock}
            onPressDecrease={() => setStock((state) => state - 1)}
            onPressIncrease={() => setStock((state) => state + 1)}
            editable={true}
            onChangeText={setStock}
          />
        </View>
      </BaseDialog.Content>
      <BaseDialog.Actions>
        <Button style={{ marginRight: 8 }} onPress={onCancel}>
          Batal
        </Button>
        <Button
          mode="contained"
          contentStyle={{ paddingHorizontal: 24 }}
          onPress={() => onSave({ isAlwaysInStock, stock })}
        >
          Simpan
        </Button>
      </BaseDialog.Actions>
    </BaseDialog>
  );
};

interface InventoryItemProps {
  itemData: ProductData;
  onPressSaveUpdateStock: (data: ProductStockData) => void;
  onPressUpdateDetail: () => void;
}

const InventoryItem = (props: InventoryItemProps) => {
  const theme = useTheme();
  const itemAcronym = props.itemData.name.match(/\b(\w)/g)?.join("") || "?";

  const isInStock = props.itemData.isAlwaysInStock || props.itemData.stock > 0;
  let stockDisplay = props.itemData.stock.toString();
  stockDisplay = props.itemData.isAlwaysInStock ? "Selalu Ada" : stockDisplay;

  const [updateStockDialogVisible, setUpdateStockDialogVisible] =
    useState(false);
  const showDialog = () => setUpdateStockDialogVisible(true);
  const hideDialog = () => setUpdateStockDialogVisible(false);

  const onSaveStock = (data: { isAlwaysInStock: boolean; stock: number }) => {
    hideDialog();
    props.onPressSaveUpdateStock(data);
  };

  return (
    <Card mode="outlined">
      <UpdateStockDialog
        productData={props.itemData}
        visible={updateStockDialogVisible}
        onSave={onSaveStock}
        onCancel={hideDialog}
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
          <Text variant="titleMedium">{props.itemData.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ minWidth: 48 }}>
              <Text>Harga</Text>
            </View>
            <Text>{`: ${toRupiah(props.itemData.price)}`}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ minWidth: 48 }}>
              <Text>Stok</Text>
            </View>
            <Text>{`: ${stockDisplay}`}</Text>
          </View>
          {!isInStock && (
            <Chip
              style={{
                backgroundColor: theme.colors.errorContainer,
                alignSelf: "flex-start",
                borderRadius: 100,
                marginTop: 4,
              }}
              textStyle={{
                marginVertical: 4,
                color: theme.colors.error,
                ...theme.fonts.labelSmall,
              }}
            >
              Stok Habis
            </Chip>
          )}
        </View>

        <View style={styles(theme).right}>
          <Button
            mode="outlined"
            style={{ marginRight: 8 }}
            onPress={props.onPressUpdateDetail}
          >
            Ubah Produk
          </Button>
          <Button mode="contained-tonal" onPress={showDialog}>
            Ubah Stok
          </Button>
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
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });
