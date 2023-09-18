import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  useTheme,
  MD3Theme,
  Text,
  Button,
  Chip,
} from "react-native-paper";
import { toRupiah } from "../utils/currencyUtils";
import UpdateStockDialog from "./UpdateStockDialog";
import useDialog from "../hooks/useDialog";
import { ProductData, ProductStockData } from "../types/data";

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

  const [updateStockDialog, showUpdateStockDialog, hideUpdateStockDialog] =
    useDialog();

  const onSaveStock = (data: { isAlwaysInStock: boolean; stock: number }) => {
    hideUpdateStockDialog();
    props.onPressSaveUpdateStock(data);
  };

  return (
    <Card
      mode="outlined"
      style={{
        borderColor: theme.colors.outlineVariant,
        backgroundColor: theme.colors.onPrimary,
      }}
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
          <Button mode="contained-tonal" onPress={showUpdateStockDialog}>
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
