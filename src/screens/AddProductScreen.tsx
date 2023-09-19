import { StyleSheet } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDatabaseConnection } from "../data/connection";
import { ScrollView } from "react-native-gesture-handler";
import ProductForm from "../components/ProductForm";
import BaseDialog from "../components/BaseDialog";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { createProduct } from "../redux/slices/productSlice";
import { RootStackParamList } from "../types/routes";
import { CreateProductData } from "../types/data";
import { showSnackbar } from "../redux/slices/layoutSlice";

const AddProductScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "addProduct">) => {
  const theme = useTheme();
  const { productService } = useDatabaseConnection();
  const dispatch = useAppDispatch();

  const { categories } = useAppSelector((state) => state.category);

  const initialData: CreateProductData = {
    name: "",
    stock: 0,
    isAlwaysInStock: false,
    price: 0,
    imgUri: undefined,
    categories: undefined,
  };
  const [productData, setProductData] =
    useState<CreateProductData>(initialData);

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

  const createItem = useCallback(async () => {
    dispatch(
      createProduct({
        data: productData,
        service: productService,
      })
    ).then(() => {
      dispatch(
        showSnackbar({ message: `${productData.name} telah ditambahkan.` })
      );
      setSubmitSuccess(true);
      navigation.navigate("home", { screen: "inventory" });
    });
  }, [productData, productService, navigation]);

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
        onPressAddCategory={() => navigation.navigate("category")}
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
