import { StyleSheet } from "react-native";
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

  const initialData: ProductData = {
    id: 0,
    name: "",
    stock: 0,
    isAlwaysInStock: false,
    price: 0,
    imgUri: undefined,
    categories: undefined,
  };
  const [productData, setProductData] = useState<ProductData>(initialData);

  const hasUnsavedChanges =
    JSON.stringify(initialData) !== JSON.stringify(productData);

  const initialErrors: { [key in keyof CreateProductData]: string[] } = {
    name: [],
    stock: [],
    isAlwaysInStock: [],
    price: [],
    imgUri: [],
    categories: [],
  };
  const [errors, setErrors] = useState(initialErrors);

  const canSubmit = JSON.stringify(initialErrors) !== JSON.stringify(errors);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchCategory = useCallback(async () => {
    const categories = await categoryRepository.getAll();
    setCategories(categories);
  }, [categoryRepository, setCategories]);

  const createItem = useCallback(async () => {
    const selectedCategories: CategoryModel[] = categories.filter((category) =>
      productData.categories?.some(
        (selectedCategory) => selectedCategory.id == category.id
      )
    );
    const data: CreateProductData = {
      ...productData,
      categories: selectedCategories,
    };
    productRepository.create(data).then(() => {
      setSubmitSuccess(true);
      navigation.navigate("home", { screen: "inventory" });
    });
  }, [productData, productRepository, navigation]);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!hasUnsavedChanges || backAlertVisible || submitSuccess) {
        return;
      }
      e.preventDefault();
      showBackAlert();
    });
    return unsubscribe;
  }, [
    navigation,
    hasUnsavedChanges,
    backAlertVisible,
    showBackAlert,
    submitSuccess,
  ]);

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
