import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

interface Product {
  name: string;
  stock: number;
  imageUrl: string | null;
}

interface ProductProps {
  product: Product;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.todoText]}>
        {product.name} - {product.stock} - {product.imageUrl}
      </Text>
      {product.imageUrl && (
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // height: 60,
    alignItems: "center",
  },

  todoText: {
    fontSize: 24,
  },
});
