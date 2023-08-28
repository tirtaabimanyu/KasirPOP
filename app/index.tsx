import { Text, View } from "react-native";
import { Link } from "expo-router";
import ProductList from "../components/ProductList";
import { ScrollView } from "react-native-gesture-handler";

export default function Page() {
  return <ProductList />;
}
