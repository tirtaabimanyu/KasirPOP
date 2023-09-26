import { StyleSheet, View } from "react-native";
import {
  Card,
  Chip,
  Divider,
  MD3Theme,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import InputImagePicker from "./InputImagePicker";
import { useCallback, useState } from "react";
import { toNumber, toRupiah } from "../utils/formatUtils";
import InputCounter from "./InputCounter";
import { CategoryData, CreateProductData } from "../types/data";

type ErrorsType = { [key in keyof CreateProductData]: string[] };

type ProductFormProps = {
  categories: CategoryData[];
  productData: CreateProductData;
  errors: ErrorsType;
  setProductData: React.Dispatch<React.SetStateAction<CreateProductData>>;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>;
  onPressAddCategory: () => void;
};

const ProductForm = (props: ProductFormProps) => {
  const theme = useTheme();
  const initialIsDirty: { [key in keyof CreateProductData]: boolean } = {
    name: false,
    stock: false,
    isAlwaysInStock: false,
    price: false,
    imgUri: false,
    categoryIds: false,
  };
  const [isDirty, setIsDirty] = useState(initialIsDirty);

  const toggleCategory = useCallback(
    (category: CategoryData) => {
      setIsDirty((state) => ({ ...state, categoryIds: true }));
      props.setProductData((state) => {
        if (props.productData.categoryIds?.includes(category.id)) {
          const newCategoryIds = state.categoryIds?.filter(
            (selectedCategoryId) => selectedCategoryId != category.id
          );
          return {
            ...state,
            categoryIds: newCategoryIds,
          };
        } else {
          const newCategoryIds = state.categoryIds
            ? [...state.categoryIds, category.id].sort()
            : [category.id];

          return { ...state, categoryIds: newCategoryIds };
        }
      });
    },
    [props.productData, props.setProductData, setIsDirty]
  );

  return (
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
          imgUri={props.productData.imgUri}
          onRemoveImage={() => {
            props.setProductData((state) => ({ ...state, imgUri: null }));
          }}
          onSelectImage={(uri) => {
            setIsDirty((state) => ({ ...state, imgUri: true }));
            props.setProductData((state) => ({ ...state, imgUri: uri }));
          }}
          resize={{ width: 40, height: 40 }}
          base64
        />
      </View>
      <View style={styles(theme).formItem}>
        <TextInput
          label={"Nama Produk"}
          mode="outlined"
          value={props.productData.name}
          onChangeText={(value) => {
            setIsDirty((state) => ({ ...state, name: true }));
            props.setProductData((state) => ({ ...state, name: value }));
          }}
          style={styles(theme).transparent}
          error={isDirty["name"] && props.errors["name"].length > 0}
        />
        {isDirty["name"] &&
          props.errors["name"].map((value, idx) => (
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
          {props.categories.map((category, idx) => {
            const isSelected = props.productData.categoryIds?.includes(
              category.id
            );
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
            onPress={props.onPressAddCategory}
          >
            Tambah Etalase
          </Chip>
        </View>
      </View>
      <View style={[styles(theme).row, styles(theme).formItem]}>
        <View style={styles(theme).row}>
          <Text variant="bodySmall">Stok Selalu Ada</Text>
          <Switch
            value={props.productData.isAlwaysInStock}
            onValueChange={() => {
              setIsDirty((state) => ({ ...state, isAlwaysInStock: true }));
              props.setProductData((state) => ({
                ...state,
                isAlwaysInStock: !state.isAlwaysInStock,
              }));
            }}
          />
        </View>
        <Divider style={styles(theme).divider} />
        <View style={styles(theme).row}>
          <Text variant="bodySmall">Jumlah Stok</Text>
          <InputCounter
            disabled={props.productData.isAlwaysInStock}
            value={props.productData.stock}
            onPressDecrease={() =>
              props.setProductData((state) => ({
                ...state,
                stock: state.stock - 1,
              }))
            }
            onPressIncrease={() =>
              props.setProductData((state) => ({
                ...state,
                stock: state.stock + 1,
              }))
            }
            editable={true}
            onChangeText={(value) =>
              props.setProductData((state) => ({ ...state, stock: value }))
            }
            disableDecrement={props.productData.stock == 0}
          />
        </View>
      </View>
      <TextInput
        label={"Harga Produk"}
        mode="outlined"
        keyboardType="numeric"
        value={toRupiah(props.productData.price)}
        onChangeText={(value) => {
          setIsDirty((state) => ({ ...state, price: true }));
          props.setProductData((state) => ({
            ...state,
            price: toNumber(value),
          }));
        }}
        style={styles(theme).transparent}
      />
    </Card>
  );
};

export default ProductForm;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    formCard: { marginBottom: 24 },
    formCardContent: { padding: 24, backgroundColor: "white" },
    divider: {
      width: 1,
      height: "100%",
      marginLeft: 32,
      marginRight: 40,
    },
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
