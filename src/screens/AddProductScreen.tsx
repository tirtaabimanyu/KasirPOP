import { Alert, Image, StyleSheet, View } from "react-native";
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
import { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { toNumber, toRupiah } from "../utils/currencyUtils";
import { useDatabaseConnection } from "../data/connection";
import { ScrollView } from "react-native-gesture-handler";
import { CategoryModel } from "../data/entities/CategoryModel";
import InputImagePicker from "../components/InputImagePicker";

const AddProductScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "addProduct">) => {
  const theme = useTheme();
  const { productRepository, categoryRepository } = useDatabaseConnection();
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const initialSelectedCategories: {
    [key: number]: CategoryModel;
  } = {};
  const [selectedCategories, setSelectedCategories] = useState(
    initialSelectedCategories
  );

  const initialData: CreateProductData = {
    name: "",
    stock: 0,
    isAlwaysInStock: false,
    price: 0,
    imgUri: undefined,
  };
  const [productData, setProductData] =
    useState<CreateProductData>(initialData);
  const hasUnsavedChanges =
    JSON.stringify(initialData) !== JSON.stringify(productData) ||
    Object.keys(selectedCategories).length > 0;

  const initialIsDirty: { [key in keyof CreateProductData]: boolean } = {
    name: false,
    stock: false,
    isAlwaysInStock: false,
    price: false,
    imgUri: false,
    categories: false,
  };
  const [isDirty, setIsDirty] = useState(initialIsDirty);

  const initialErrors: { [key in keyof CreateProductData]: string[] } = {
    name: [],
    stock: [],
    isAlwaysInStock: [],
    price: [],
  };
  const [errors, setErrors] = useState(initialErrors);
  const canSubmit = JSON.stringify(initialErrors) !== JSON.stringify(errors);

  const resetForm = useCallback(() => {
    setProductData(initialData);
    setSelectedCategories(initialSelectedCategories);
    setIsDirty(initialIsDirty);
    setErrors(initialErrors);
  }, [setProductData, setSelectedCategories, setIsDirty, setErrors]);

  const fetchCategory = useCallback(async () => {
    const categories = await categoryRepository.getAll();
    setCategories(categories);
  }, [categoryRepository, setCategories]);

  const createItem = useCallback(async () => {
    const data = {
      ...productData,
      categories: Object.values(selectedCategories),
    };
    await productRepository.create(data);
    resetForm();
    navigation.navigate("home", { screen: "inventory" });
  }, [
    productData,
    selectedCategories,
    productRepository,
    resetForm,
    navigation,
  ]);

  const toggleCategory = useCallback(
    (category: CategoryModel) => {
      setIsDirty((state) => ({ ...state, categories: true }));
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
    },
    [selectedCategories, setSelectedCategories, setIsDirty]
  );

  useEffect(() => {
    const newErrors = initialErrors;
    if (productData.name.length == 0) {
      newErrors["name"].push("Nama produk tidak boleh kosong");
    }
    setErrors(newErrors);
  }, [productData, hasUnsavedChanges]);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          "Apakah Anda yakin keluar halaman?",
          "Perubahan yang ada di halaman ini akan hilang jika Anda keluar halaman.",
          [
            { text: "Batal", style: "cancel", onPress: () => {} },
            {
              text: "Keluar Halaman",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );

  return (
    <ScrollView
      style={styles(theme).container}
      automaticallyAdjustKeyboardInsets
    >
      <Card
        mode="outlined"
        style={styles(theme).formCard}
        contentStyle={styles(theme).formCardContent}
      >
        <View style={styles(theme).formItem}>
          <Text variant="bodySmall" style={styles(theme).label}>
            Foto Produk (Opsional)
          </Text>
          <InputImagePicker
            imgUri={productData.imgUri}
            onRemoveImage={() => {
              setProductData((state) => ({ ...state, imgUri: undefined }));
            }}
            onSelectImage={(uri) => {
              setIsDirty((state) => ({ ...state, imgUri: true }));
              setProductData((state) => ({ ...state, imgUri: uri }));
            }}
            base64
          />
        </View>
        <View style={styles(theme).formItem}>
          <TextInput
            label={"Nama Produk"}
            mode="outlined"
            value={productData.name}
            onChangeText={(value) => {
              setIsDirty((state) => ({ ...state, name: true }));
              setProductData({ ...productData, name: value });
            }}
            style={styles(theme).transparent}
            error={isDirty["name"] && errors["name"].length > 0}
          />
          {isDirty["name"] &&
            errors["name"].map((value, idx) => (
              <Text
                key={`error-name-${idx}`}
                style={{ color: theme.colors.error, marginTop: 4 }}
              >
                {value}
              </Text>
            ))}
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text variant="bodySmall" style={styles(theme).label}>
            Etalase (Opsional)
          </Text>
          <View style={[styles(theme).row, { justifyContent: "flex-start" }]}>
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
              style={styles(theme).transparent}
              onPress={async () => {
                await categoryRepository.create({
                  name: Math.random().toString(),
                });
                await fetchCategory();
              }}
            >
              Tambah Etalase
            </Chip>
          </View>
        </View>
        <View style={[styles(theme).row, styles(theme).formItem]}>
          <View style={styles(theme).row}>
            <Text variant="bodySmall">Stok Selalu Ada</Text>
            <Switch
              value={productData.isAlwaysInStock}
              onValueChange={() => {
                setIsDirty((state) => ({ ...state, isAlwaysInStock: true }));
                setProductData({
                  ...productData,
                  isAlwaysInStock: !productData.isAlwaysInStock,
                });
              }}
            />
          </View>
          <Divider style={styles(theme).divider} />
          <View style={styles(theme).row}>
            <Text variant="bodySmall">Jumlah Stok</Text>
            <TextInput
              keyboardType="numeric"
              value={productData.stock.toString()}
              onChangeText={(value) => {
                setIsDirty((state) => ({ ...state, stock: true }));
                setProductData({ ...productData, stock: toNumber(value) });
              }}
              disabled={productData.isAlwaysInStock}
            />
          </View>
        </View>
        <TextInput
          label={"Harga Produk"}
          mode="outlined"
          keyboardType="numeric"
          value={toRupiah(productData.price)}
          onChangeText={(value) => {
            setIsDirty((state) => ({ ...state, price: true }));
            setProductData({ ...productData, price: toNumber(value) });
          }}
          style={styles(theme).transparent}
        />
      </Card>
      <Button
        mode="contained"
        style={styles(theme).saveButton}
        onPress={createItem}
        disabled={canSubmit}
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
    formCard: { marginBottom: 24 },
    formCardContent: { padding: 24, backgroundColor: "white" },
    divider: {
      width: 1,
      height: "100%",
      marginLeft: 32,
      marginRight: 40,
    },
    saveButton: { alignSelf: "flex-end" },
    formItem: { marginBottom: 24 },
    transparent: { backgroundColor: "transparent" },
    row: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: { marginBottom: 8 },
  });
