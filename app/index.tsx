import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Text>This is home</Text>
      <Link href={"/inventory"}>Inventory</Link>
      <Link href={"/transactions"}>Transactions</Link>
    </View>
  );
}
