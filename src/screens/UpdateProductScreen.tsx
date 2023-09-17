import { StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../data/connection";
import { ScrollView } from "react-native-gesture-handler";
import { CategoryModel } from "../data/entities/CategoryModel";
import ProductForm from "../components/ProductForm";
import BaseDialog from "../components/BaseDialog";

const UpdateProductScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "updateProduct">) => {
  const theme = useTheme();
  const { productRepository, categoryRepository } = useDatabaseConnection();

  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const initialData: ProductData = route.params.productData;
  const [newProductData, setNewProductData] =
    useState<ProductData>(initialData);

  const hasUnsavedChanges =
    JSON.stringify(initialData) !== JSON.stringify(newProductData);

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
  const [canNavigate, setCanNavigate] = useState(false);

  const fetchCategory = useCallback(async () => {
    const categories = await categoryRepository.getAll();
    setCategories(categories);
  }, [categoryRepository, setCategories]);

  const updateItem = useCallback(async () => {
    const selectedCategories: CategoryModel[] = categories.filter((category) =>
      newProductData.categories?.some(
        (selectedCategory) => selectedCategory.id == category.id
      )
    );
    const data: UpdateProductData = {
      ...newProductData,
      categories: selectedCategories,
    };
    await productRepository.update(data);
    setCanNavigate(true);
    navigation.navigate("home", { screen: "inventory" });
  }, [newProductData, productRepository, navigation]);

  const deleteItem = useCallback(async () => {
    await productRepository.delete(route.params.productData.id);
    setCanNavigate(true);
    navigation.navigate("home", { screen: "inventory" });
  }, [productRepository]);

  const validation = () => {
    const newErrors = initialErrors;
    if (newProductData.name.length == 0) {
      newErrors["name"].push("Nama produk tidak boleh kosong");
    }
    setErrors(newErrors);
  };

  const [backAlertVisible, setBackAlertVisible] = useState(false);
  const showBackAlert = () => setBackAlertVisible(true);
  const hideBackAlert = () => setBackAlertVisible(false);

  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const showDeleteAlert = () => setDeleteAlertVisible(true);
  const hideDeleteAlert = () => setDeleteAlertVisible(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(validation, [newProductData, hasUnsavedChanges]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!hasUnsavedChanges || backAlertVisible || canNavigate) {
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
    canNavigate,
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
      <BaseDialog visible={deleteAlertVisible} onDismiss={hideDeleteAlert}>
        <BaseDialog.Title>{`Hapus ${route.params.productData.name}?`}</BaseDialog.Title>
        <BaseDialog.Content>
          <Text variant="bodyMedium">
            {`Apakah Anda yakin untuk menghapus ${route.params.productData.name}? Produk yang telah dihapus akan hilang dari Inventori.`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={deleteItem} style={{ paddingHorizontal: 16 }}>
            Hapus Produk
          </Button>
          <Button
            mode="contained"
            onPress={hideDeleteAlert}
            style={{ paddingHorizontal: 24 }}
          >
            Kembali
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <ProductForm
        categories={categories}
        productData={newProductData}
        setProductData={setNewProductData}
        errors={errors}
        setErrors={setErrors}
      />
      <View style={styles(theme).actionButtonContainer}>
        <Button
          mode="outlined"
          icon={"trash-can-outline"}
          style={styles(theme).saveButton}
          onPress={showDeleteAlert}
          disabled={canSubmit}
        >
          Hapus Produk
        </Button>
        <Button
          mode="contained"
          style={styles(theme).saveButton}
          onPress={updateItem}
          disabled={canSubmit}
        >
          Simpan
        </Button>
      </View>
    </ScrollView>
  );
};

export default UpdateProductScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
    },
    actionButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    saveButton: {
      alignSelf: "flex-end",
    },
  });
