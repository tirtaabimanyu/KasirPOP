import { useEffect, useState } from "react";
import BaseDialog from "./BaseDialog";
import { View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import InputCounter from "./InputCounter";
import { ProductData, ProductStockData } from "../types/data";

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

  const toggleSwitch = () => {
    setStock(productData.stock);
    setIsAlwaysInStock((state) => !state);
  };

  useEffect(() => {
    setIsAlwaysInStock(productData.isAlwaysInStock);
    setStock(productData.stock);
  }, [productData]);

  return (
    <BaseDialog visible={visible} dismissable={true} onDismiss={onCancel}>
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
          <Switch value={isAlwaysInStock} onValueChange={toggleSwitch} />
        </View>
        {!isAlwaysInStock && (
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
              disableDecrement={stock <= 0}
            />
          </View>
        )}
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

export default UpdateStockDialog;
