import { View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { useState } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { CashierStackParamList } from "../../routes/CashierStack";

type PaymentScreenProps = StackScreenProps<CashierStackParamList, "payment">;

export default function PaymentScreen(props: PaymentScreenProps) {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>Transaksi sudah selesai</Text>
          <Button onPress={() => null}>Cetak Struk Dapur</Button>
          <Button
            onPress={() => {
              hideModal;
              props.navigation.navigate("cashier");
            }}
          >
            Tutup
          </Button>
        </Modal>
      </Portal>

      <Text onPress={showModal}>Terima Pembayaran</Text>
    </View>
  );
}
