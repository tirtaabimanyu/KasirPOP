import { Stack, router } from "expo-router";
import { View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { useState } from "react";

export default function PaymentPage() {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: "Payment" }} />
      <Text>Hello</Text>
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
              router.replace("cashier");
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
