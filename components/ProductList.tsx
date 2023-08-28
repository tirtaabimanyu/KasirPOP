import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import { useDatabaseConnection } from "../data/connection";

import Product from "./Product";

interface ProductItem {
  id: number;
  name: string;
  stock: number;
}

interface Product {
  name: string;
  stock: number;
}

const ProductList: React.FC = () => {
  const { productsRepository } = useDatabaseConnection();

  const [newProduct, setNewProduct] = useState<Product>({ name: "", stock: 0 });
  const [products, setProducts] = useState<ProductItem[]>([]);

  const handleCreateProduct = useCallback(async () => {
    const product = await productsRepository.create({
      name: newProduct.name,
      stock: newProduct.stock,
    });

    setProducts((current) => [...current, product]);

    setNewProduct({ name: "", stock: 0 });
  }, [newProduct, productsRepository]);

  useEffect(() => {
    productsRepository.getAll().then(setProducts);
  }, [productsRepository]);

  return (
    <View style={styles.container}>
      <View style={styles.newTodoContainer}>
        <TextInput
          style={styles.newTodoInput}
          value={newProduct.name}
          onChangeText={(e) =>
            setNewProduct({ name: e, stock: newProduct.stock })
          }
        />
        <TextInput
          style={styles.newTodoInput}
          value={String(newProduct.stock)}
          onChangeText={(e) =>
            setNewProduct({ name: newProduct.name, stock: Number(e) })
          }
        />
        <Button color={"red"} title="Create" onPress={handleCreateProduct} />
      </View>

      <View style={styles.todosContainer}>
        {products.map((product) => (
          <TouchableOpacity key={String(product.id)}>
            <Product name={product.name} stock={product.stock} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },

  newTodoContainer: {
    marginTop: 80,
    marginBottom: 40,
  },

  newTodoInput: {
    height: 48,
    marginBottom: 20,

    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#aaa",

    paddingHorizontal: 16,

    fontSize: 20,
  },

  todosContainer: {
    flex: 1,
  },

  button: {
    backgroundColor: "red",
  },
});
