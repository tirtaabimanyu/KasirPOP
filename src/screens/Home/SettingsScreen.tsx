import { DrawerScreenProps } from "@react-navigation/drawer";
import { HomeDrawerParamList, RootStackParamList } from "../../types/routes";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Divider,
  List,
  MD3Theme,
  Text,
  useTheme,
} from "react-native-paper";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";

const SettingsScreen = ({
  navigation,
}: CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, "settings">,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const theme = useTheme();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles(theme).container}
    >
      <Card.Title
        title="Pengaturan"
        titleVariant="headlineLarge"
        style={styles(theme).title}
      />
      <Card
        mode="outlined"
        style={[styles(theme).cardContainer, { marginBottom: 24 }]}
        contentStyle={styles(theme).cardContent}
      >
        <Text variant="titleMedium" style={styles(theme).sectionTitle}>
          Kasir
        </Text>
        <List.Item
          title="Etalase"
          left={(props) => <List.Icon {...props} icon={"shape-outline"} />}
          right={(props) => <List.Icon {...props} icon={"menu-right"} />}
          onPress={() => navigation.navigate("category")}
        />
        <Divider />
        <List.Item
          title="Metode Pembayaran"
          left={(props) => <List.Icon {...props} icon={"cash"} />}
          right={(props) => <List.Icon {...props} icon={"menu-right"} />}
          onPress={() => navigation.navigate("paymentType")}
        />
        <Divider />
        <List.Item
          title="Struk & Printer"
          left={(props) => <List.Icon {...props} icon={"printer-pos"} />}
          right={(props) => <List.Icon {...props} icon={"menu-right"} />}
          onPress={() => navigation.navigate("printerSettings")}
        />
      </Card>
      <Card
        mode="outlined"
        style={styles(theme).cardContainer}
        contentStyle={styles(theme).cardContent}
      >
        <Text variant="titleMedium" style={styles(theme).sectionTitle}>
          Lainnya
        </Text>
        <List.Item
          title="Informasi Toko"
          left={(props) => <List.Icon {...props} icon={"store-edit-outline"} />}
          right={(props) => <List.Icon {...props} icon={"menu-right"} />}
          onPress={() => navigation.navigate("storeSettings")}
        />
      </Card>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 32,
      paddingTop: 16,
      paddingBottom: 24,
    },
    title: { paddingLeft: 0, minHeight: 0, marginBottom: 24 },
    sectionTitle: { color: theme.colors.outline },
    cardContainer: {
      backgroundColor: "white",
      borderColor: theme.colors.outlineVariant,
    },
    cardContent: {
      padding: 16,
    },
  });
