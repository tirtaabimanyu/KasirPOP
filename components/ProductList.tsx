import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useDatabaseConnection } from "../data/connection";

import { default as ProductCard } from "./Product";
import { ScrollView } from "react-native-gesture-handler";

interface ProductItem {
  id: number;
  name: string;
  stock: number;
  imageUrl: string | null;
}

interface Product {
  name: string;
  stock: number;
  imageUrl: string | null;
}

const ProductList: React.FC = () => {
  const { productsRepository } = useDatabaseConnection();

  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    stock: 0,
    imageUrl: null,
  });
  const [products, setProducts] = useState<ProductItem[]>([]);

  const handleCreateProduct = useCallback(async () => {
    const product = await productsRepository.create({
      name: newProduct.name,
      stock: newProduct.stock,
      imageUrl: newProduct.imageUrl,
    });

    setProducts((current) => [...current, product]);

    setNewProduct({ name: "", stock: 0, imageUrl: null });
  }, [newProduct, productsRepository]);

  useEffect(() => {
    productsRepository.getAll().then(setProducts);
  }, [productsRepository]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProduct({ ...newProduct, imageUrl: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.newTodoContainer}>
        <TextInput
          style={styles.newTodoInput}
          value={newProduct.name}
          onChangeText={(e) =>
            setNewProduct({
              ...newProduct,
              name: e,
            })
          }
        />
        <TextInput
          style={styles.newTodoInput}
          value={String(newProduct.stock)}
          onChangeText={(e) =>
            setNewProduct({
              ...newProduct,
              stock: Number(e),
            })
          }
        />
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {newProduct.imageUrl && (
          <Image
            source={{ uri: newProduct.imageUrl }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <Button color={"red"} title="Create" onPress={handleCreateProduct} />
      </View>

      <View style={styles.todosContainer}>
        {products.map((product) => (
          <ProductCard product={product} key={String(product.id)} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },

  newTodoContainer: {},

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
