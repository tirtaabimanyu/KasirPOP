import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function SummaryPage() {
  return (
    <View>
      <Stack.Screen
        options={{ headerShown: true, title: "Ringkasan Pesanan" }}
      />
      <Text>Hello</Text>
      <Link href="cashier/payment" replace>
        Bayar
      </Link>
    </View>
  );
}
