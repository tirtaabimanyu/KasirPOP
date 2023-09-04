import { Text, View } from "react-native";
import { Link, Stack } from "expo-router";

export default function Page() {
  return (
    <View>
      <Stack.Screen options={{ headerShown: true }} />
      <Text>This is detail</Text>
      <Link href={"/"}>Home</Link>
      <Link href={"/inventory"}>Inventory</Link>
    </View>
  );
}
