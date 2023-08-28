import { Text, View } from "react-native";
import { Link } from "expo-router";
import ProductList from "../components/ProductList";

export default function Page() {
  return (
    <View style={{ flex: 1, flexDirection: "column", padding: 20 }}>
      <ProductList />
    </View>
  );
}
