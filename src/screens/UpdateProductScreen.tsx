import { StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../data/connection";
import { ScrollView } from "react-native-gesture-handler";
import ProductForm from "../components/ProductForm";
import BaseDialog from "../components/BaseDialog";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { deleteProduct, updateProduct } from "../redux/slices/productSlice";
import { showSnackbar } from "../redux/slices/layoutSlice";
import { RootStackParamList } from "../types/routes";
import { CreateProductData, ProductData } from "../types/data";

const UpdateProductScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "updateProduct">) => {
  const theme = useTheme();
  const { productService } = useDatabaseConnection();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  const initialData: ProductData = route.params.productData;
  const [newProductData, setNewProductData] =
    useState<CreateProductData>(initialData);

  const hasUnsavedChanges =
    JSON.stringify(initialData) !== JSON.stringify(newProductData);

  const initialErrors: { [key in keyof CreateProductData]: string[] } = {
    name: [],
    stock: [],
    isAlwaysInStock: [],
    price: [],
    imgUri: [],
    categoryIds: [],
  };
  const [errors, setErrors] = useState(initialErrors);

  const canSubmit = JSON.stringify(initialErrors) !== JSON.stringify(errors);
  const [canNavigate, setCanNavigate] = useState(false);

  const updateItem = useCallback(async () => {
    dispatch(
      updateProduct({
        data: { id: route.params.productData.id, ...newProductData },
        service: productService,
      })
    ).then(() => {
      dispatch(
        showSnackbar({ message: `${newProductData.name} telah diperbarui.` })
      );
      setCanNavigate(true);
      navigation.navigate("home", { screen: "inventory" });
    });
  }, [newProductData, productService, navigation]);

  const deleteItem = useCallback(async () => {
    dispatch(
      deleteProduct({
        id: route.params.productData.id,
        service: productService,
      })
    ).then(() => {
      setCanNavigate(true);
      dispatch(
        showSnackbar({
          message: `${route.params.productData.name} telah dihapus`,
        })
      );
      navigation.navigate("home", { screen: "inventory" });
    });
  }, [productService]);

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
      contentContainerStyle={{ paddingBottom: 24 }}
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
      <BaseDialog
        visible={deleteAlertVisible}
        dismissable={true}
        onDismiss={hideDeleteAlert}
      >
        <BaseDialog.Title>{`Apakah Anda yakin menghapus ${route.params.productData.name}?`}</BaseDialog.Title>
        <BaseDialog.Content>
          <Text variant="bodyMedium">
            {`Produk yang telah dihapus akan hilang dari Inventori.`}
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
        onPressAddCategory={() => navigation.navigate("category")}
      />
      <View style={styles(theme).actionButtonContainer}>
        <Button
          mode="outlined"
          icon={"trash-can-outline"}
          style={styles(theme).saveButton}
          onPress={showDeleteAlert}
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
