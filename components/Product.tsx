import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface ProductProps {
  name: string;
  stock: number;
}

const Product: React.FC<ProductProps> = ({ name, stock }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.todoText]}>
        {name} - {stock}
      </Text>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    alignItems: "center",
  },

  todoText: {
    fontSize: 24,
  },
});
