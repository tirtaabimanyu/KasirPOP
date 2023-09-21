import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Card,
  IconButton,
  List,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { RootStackParamList } from "../types/routes";
import { useEffect, useState } from "react";
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { Pressable, StyleSheet, View } from "react-native";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import {
  createCategory,
  deleteCategory,
  swapDisplayOrder,
  updateCategory,
} from "../redux/slices/categorySlice";
import { useDatabaseConnection } from "../data/connection";
import { showSnackbar } from "../redux/slices/layoutSlice";
import Row from "../components/Row";
import { FlatList } from "react-native-gesture-handler";
import { CategoryData } from "../types/data";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store";
import { CategoryService } from "../data/services/CategoryService";
import { DatabaseConnectionContextData } from "../types/connection";

const AddCategoryButton =
  (onPress: () => void) => (props: HeaderButtonProps) => {
    return (
      <View {...props}>
        <Button icon={"plus"} mode="contained" onPress={onPress}>
          Tambah Etalase
        </Button>
      </View>
    );
  };
const RowSeparator = () => <View style={{ height: 16 }} />;
const CategoryItem = ({
  itemData,
  prevItem,
  nextItem,
  dispatch,
  services,
}: {
  itemData: CategoryData;
  prevItem: CategoryData | undefined;
  nextItem: CategoryData | undefined;
  dispatch: AppDispatch;
  services: DatabaseConnectionContextData;
}) => {
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(itemData.name);
  const [deleteDialog, showDeleteDialog, hideDeleteDialog] = useDialog();

  const onSaveEdit = () => {
    dispatch(
      updateCategory({ data: { ...itemData, name: newName }, services })
    ).then(() => {
      dispatch(
        showSnackbar({ message: `Etalase ${newName} telah diperbarui.` })
      );
      setIsEditing(false);
    });
  };

  const onDelete = () => {
    dispatch(
      deleteCategory({ id: itemData.id, service: services.categoryService })
    ).then(() => {
      dispatch(
        showSnackbar({ message: `Etalase ${itemData.name} telah dihapus.` })
      );
      hideDeleteDialog();
    });
  };

  return (
    <Row
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      }}
    >
      <BaseDialog visible={deleteDialog}>
        <BaseDialog.Title>{`Apakah anda yakin menghapus ${itemData.name}?`}</BaseDialog.Title>
        <BaseDialog.Content>
          <Text variant="bodyMedium">{`Dengan menghapus etalase Anda menyadari bahwa:
 • Etalase yang telah dihapus akan hilang dari menu Kasir dan Etalase
 • Barang yang berada dalam etalase tersebut akan tetap ada`}</Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button onPress={onDelete} style={{ paddingHorizontal: 16 }}>
            Hapus Etalase
          </Button>
          <Button
            mode="contained"
            onPress={hideDeleteDialog}
            style={{ paddingHorizontal: 24 }}
          >
            Kembali
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <View style={{ marginRight: 16 }}>
        <Pressable
          onPress={() =>
            prevItem &&
            dispatch(
              swapDisplayOrder({
                categories: [itemData, prevItem],
                service: services.categoryService,
              })
            )
          }
          disabled={prevItem == undefined}
        >
          <MaterialCommunityIcons
            name="arrow-up"
            size={24}
            color={theme.colors.outline}
            style={{ marginBottom: 4 }}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            nextItem &&
            dispatch(
              swapDisplayOrder({
                categories: [itemData, nextItem],
                service: services.categoryService,
              })
            )
          }
          disabled={nextItem == undefined}
        >
          <MaterialCommunityIcons
            name="arrow-down"
            size={24}
            color={theme.colors.outline}
          />
        </Pressable>
      </View>
      {isEditing ? (
        <Row style={{ flex: 1, alignItems: "center" }}>
          <TextInput
            mode="outlined"
            value={newName}
            onChangeText={setNewName}
            label={"Nama Etalase"}
            style={{ width: "30%" }}
            autoFocus
          />
          <Button onPress={onSaveEdit}>Simpan</Button>
          <Button onPress={() => setIsEditing(false)}>Batal</Button>
        </Row>
      ) : (
        <Row style={{ flex: 1, alignItems: "center" }}>
          <Text variant="titleMedium">{`${itemData.name}`}</Text>
          <IconButton
            icon={"pencil-outline"}
            iconColor={theme.colors.outline}
            onPress={() => setIsEditing(true)}
          />
        </Row>
      )}

      <IconButton
        icon={"trash-can-outline"}
        iconColor={theme.colors.outline}
        onPress={showDeleteDialog}
      />
    </Row>
  );
};

const CategoryScreen = (
  props: NativeStackScreenProps<RootStackParamList, "category">
) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const services = useDatabaseConnection();
  const { categories } = useAppSelector((state) => state.category);

  const [addCategoryDialog, showAddCategoryDialog, hideAddCategoryDialog] =
    useDialog();
  const [newCategoryName, setNewCategoryName] = useState("");

  const onCreateCategory = () => {
    dispatch(
      createCategory({
        data: {
          name: newCategoryName,
        },
        service: services.categoryService,
      })
    ).then(() => {
      hideAddCategoryDialog();
      setNewCategoryName("");
      dispatch(
        showSnackbar({
          message: `Etalase ${newCategoryName} telah ditambahkan.`,
        })
      );
    });
  };

  const onDismissCreateCategory = () => {
    hideAddCategoryDialog();
    setNewCategoryName("");
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: AddCategoryButton(showAddCategoryDialog),
    });
  }, []);

  return (
    <View style={styles(theme).container}>
      <BaseDialog
        visible={addCategoryDialog}
        dismissable
        onDismiss={onDismissCreateCategory}
      >
        <BaseDialog.Title>Tambah Etalase</BaseDialog.Title>
        <BaseDialog.Content>
          <TextInput
            mode="outlined"
            label={"Nama Etalase"}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            autoFocus
          />
        </BaseDialog.Content>
        <BaseDialog.Actions style={{ padding: 16 }}>
          <Button onPress={onDismissCreateCategory}>Batal</Button>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 16 }}
            onPress={onCreateCategory}
          >
            Tambah
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <Card
        mode="outlined"
        style={[styles(theme).cardContainer, { marginBottom: 24 }]}
        contentStyle={styles(theme).cardContent}
      >
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          Gambaran Urutan Etalase dalam menu Kasir
        </Text>
        <Row style={{ backgroundColor: theme.colors.surface, height: 48 }}>
          <View style={styles(theme).tabBarItem}>
            <Text variant="titleSmall" style={styles(theme).tabBarLabel}>
              Semua
            </Text>
          </View>
          {categories.map((category, idx) => (
            <View style={styles(theme).tabBarItem} key={`tabBar-${idx}`}>
              <Text variant="titleSmall" style={styles(theme).tabBarLabel}>
                {category.name}
              </Text>
            </View>
          ))}
        </Row>
      </Card>
      <Text variant="bodyMedium" style={{ marginBottom: 24 }}>
        Gunakan tombol panah atas untuk menaikkan posisi Etalase dan tombol
        panah bawah untuk menurunkan posisi Etalase.
      </Text>
      <FlatList
        renderItem={({ item, index }) => (
          <CategoryItem
            itemData={item}
            prevItem={categories[index - 1]}
            nextItem={categories[index + 1]}
            dispatch={dispatch}
            services={services}
          />
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
        ItemSeparatorComponent={RowSeparator}
        data={categories}
        automaticallyAdjustKeyboardInsets
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default CategoryScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 16,
      paddingBottom: 24,
    },
    title: { paddingLeft: 0, minHeight: 0, marginBottom: 24 },
    cardContainer: {
      backgroundColor: "white",
      borderColor: theme.colors.outlineVariant,
    },
    cardContent: {
      padding: 16,
    },
    tabBarItem: {
      minWidth: 90,
      paddingHorizontal: 24,
    },
    tabBarLabel: { color: theme.colors.onSurfaceVariant },
  });
