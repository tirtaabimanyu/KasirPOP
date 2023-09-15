import { Image, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  MD3Theme,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { toNumber, toRupiah } from "../utils/currencyUtils";
import * as ImagePicker from "expo-image-picker";
import { useDatabaseConnection } from "../data/connection";
import { ScrollView } from "react-native-gesture-handler";
import { CategoryModel } from "../data/entities/CategoryModel";

const AddProductScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "addProduct">) => {
  const theme = useTheme();
  const { productRepository, categoryRepository } = useDatabaseConnection();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: number]: CategoryModel;
  }>({});

  const initialData: CreateProductData = {
    name: "",
    stock: 0,
    isAlwaysInStock: false,
    price: 0,
    imgUri: undefined,
  };
  const [productData, setProductData] =
    useState<CreateProductData>(initialData);

  const productImage = productData.imgUri
    ? { uri: productData.imgUri }
    : require("../../assets/image-placeholder.png");

  const fetchCategory = async () => {
    const categories = await categoryRepository.getAll();
    setCategories(categories);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setProductData({
        ...productData,
        imgUri: `data:image/jpeg;base64,${result.base64}`,
      });
    }
  };

  const createItem = async () => {
    const data = { ...productData, categories: Object.values(categories) };
    await productRepository.create(data);
    navigation.navigate("home", { screen: "inventory" });
  };

  const toggleCategory = (category: CategoryModel) => {
    if (category.id in selectedCategories) {
      setSelectedCategories((state) => {
        const { [category.id]: categoryId, ...rest } = state;
        return rest;
      });
    } else {
      setSelectedCategories((state) => {
        return { ...state, [category.id]: category };
      });
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <ScrollView
      style={styles(theme).container}
      automaticallyAdjustKeyboardInsets
    >
      <Card
        mode="outlined"
        style={{ marginBottom: 24 }}
        contentStyle={{ padding: 24, backgroundColor: "white" }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text variant="bodySmall" style={{ marginBottom: 8 }}>
            Foto Produk (Opsional)
          </Text>
          <Card
            mode="outlined"
            style={{ borderRadius: 4, backgroundColor: "transparent" }}
            contentStyle={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={productImage} style={{ width: 56, height: 56 }} />
              <Text variant="bodySmall" style={{ marginLeft: 8 }}>
                {productData.imgUri
                  ? "Gambar berhasil dipilih"
                  : "Belum ada gambar terpilih"}
              </Text>
            </View>
            {productData.imgUri ? (
              <Button
                mode="text"
                icon={"trash-can-outline"}
                onPress={() =>
                  setProductData({ ...productData, imgUri: undefined })
                }
                textColor={theme.colors.error}
              >
                Hapus Foto
              </Button>
            ) : (
              <Button mode="text" icon={"plus"} onPress={pickImage}>
                Unggah Foto
              </Button>
            )}
          </Card>
        </View>
        <TextInput
          label={"Nama Produk"}
          mode="outlined"
          value={productData.name}
          onChangeText={(value) =>
            setProductData({ ...productData, name: value })
          }
          style={{ marginBottom: 24, backgroundColor: "transparent" }}
        />
        <View style={{ marginBottom: 24 }}>
          <Text variant="bodySmall" style={{ marginBottom: 8 }}>
            Etalase (Opsional)
          </Text>
          <View style={{ flexDirection: "row" }}>
            {categories.map((category, idx) => {
              const isSelected = category.id in selectedCategories;
              return (
                <Chip
                  key={`category-${idx}`}
                  mode="outlined"
                  style={[
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                    {
                      marginRight: 8,
                    },
                  ]}
                  onPress={() => toggleCategory(category)}
                  selected={isSelected}
                  showSelectedCheck={false}
                >
                  {category.name}
                </Chip>
              );
            })}
            <Chip
              icon={"plus"}
              mode="outlined"
              style={{ backgroundColor: "transparent" }}
              onPress={() =>
                navigation.navigate("home", { screen: "settings" })
              }
            >
              Tambah Etalase
            </Chip>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="bodySmall">Stok Selalu Ada</Text>
            <Switch
              value={productData.isAlwaysInStock}
              onValueChange={() =>
                setProductData({
                  ...productData,
                  isAlwaysInStock: !productData.isAlwaysInStock,
                })
              }
            />
          </View>
          <Divider
            style={{
              width: 1,
              height: "100%",
              marginLeft: 32,
              marginRight: 40,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="bodySmall">Jumlah Stok</Text>
            <TextInput
              keyboardType="numeric"
              value={productData.stock.toString()}
              onChangeText={(value) =>
                setProductData({ ...productData, stock: toNumber(value) })
              }
              disabled={productData.isAlwaysInStock}
            />
          </View>
        </View>
        <TextInput
          label={"Harga Produk"}
          mode="outlined"
          keyboardType="numeric"
          value={toRupiah(productData.price)}
          onChangeText={(value) =>
            setProductData({ ...productData, price: toNumber(value) })
          }
          style={{ backgroundColor: "transparent" }}
        />
      </Card>
      <Button
        mode="contained"
        style={{ alignSelf: "flex-end" }}
        onPress={createItem}
      >
        Simpan
      </Button>
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
    },
  });
