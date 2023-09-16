import { Alert, StyleSheet } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../data/connection";
import { ScrollView } from "react-native-gesture-handler";
import { CategoryModel } from "../data/entities/CategoryModel";
import ProductForm from "../components/ProductForm";
import BaseDialog from "../components/BaseDialog";

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
    setErrors(initialErrors);
  }, [setProductData, setSelectedCategories, setErrors]);

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

  const validation = () => {
    const newErrors = initialErrors;
    if (productData.name.length == 0) {
      newErrors["name"].push("Nama produk tidak boleh kosong");
    }
    setErrors(newErrors);
  };

  const [backAlertVisible, setBackAlertVisible] = useState(false);
  const showBackAlert = () => setBackAlertVisible(true);
  const hideBackAlert = () => setBackAlertVisible(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(validation, [productData, hasUnsavedChanges]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges || backAlertVisible) {
          return;
        }

        e.preventDefault();
        showBackAlert();
      }),
    [navigation, hasUnsavedChanges, backAlertVisible, showBackAlert]
  );

  return (
    <ScrollView
      style={styles(theme).container}
      automaticallyAdjustKeyboardInsets
    >
      <BaseDialog
        visible={backAlertVisible}
        onDismiss={hideBackAlert}
        dismissable={true}
      >
        <BaseDialog.Title>Apakah Anda yakin keluar halaman?</BaseDialog.Title>
        <BaseDialog.Content>
          <Text variant="bodyMedium">
            {`Perubahan yang ada di halaman ini akan hilang jika Anda keluar halaman.`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={hideBackAlert} style={{ paddingHorizontal: 16 }}>
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 24 }}
          >
            Keluar Halaman
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <ProductForm
        categories={categories}
        productData={productData}
        setProductData={setProductData}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        errors={errors}
        setErrors={setErrors}
      />
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
    saveButton: {
      alignSelf: "flex-end",
    },
  });
