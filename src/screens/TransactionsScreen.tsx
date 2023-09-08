import { DrawerScreenProps } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Card,
  Divider,
  List,
  MD3Theme,
  Text,
  useTheme,
} from "react-native-paper";

const Tab = createMaterialTopTabNavigator();

const Screen1 = () => (
  <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
    <Card
      mode="outlined"
      style={{ flex: 1, marginRight: 12, marginBottom: 24 }}
      contentStyle={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <List.Accordion title={<Text variant="titleMedium">Hari Ini</Text>}>
        <Divider />
        <List.Item
          title={<Text variant="bodyLarge">Order #2</Text>}
          description={<Text variant="labelSmall">Hari ini, 16:00 WIB</Text>}
          right={(props) => (
            <Text variant="labelLarge" {...props}>
              Rp50,000
            </Text>
          )}
        />
        <Divider />
        <List.Item
          title={<Text variant="bodyLarge">Order #1</Text>}
          description={<Text variant="labelSmall">Hari ini, 16:00 WIB</Text>}
          right={(props) => (
            <Text variant="labelLarge" {...props}>
              Rp50,000
            </Text>
          )}
        />
      </List.Accordion>
    </Card>
    <Card
      mode="outlined"
      style={{ flex: 1, marginRight: 12 }}
      contentStyle={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <List.Accordion
        title={<Text variant="titleMedium">28 Agustus 2023</Text>}
      >
        <Divider />
        <List.Item
          title={<Text variant="bodyLarge">Order #2</Text>}
          description={<Text variant="labelSmall">Hari ini, 16:00 WIB</Text>}
          right={(props) => (
            <Text variant="labelLarge" {...props}>
              Rp50,000
            </Text>
          )}
        />
        <Divider />
        <List.Item
          title={<Text variant="bodyLarge">Order #1</Text>}
          description={<Text variant="labelSmall">Hari ini, 16:00 WIB</Text>}
          right={(props) => (
            <Text variant="labelLarge" {...props}>
              Rp50,000
            </Text>
          )}
        />
      </List.Accordion>
    </Card>
  </ScrollView>
);

const TransactionsScreen = ({
  navigation,
  route,
}: DrawerScreenProps<RootDrawerParamList>) => {
  const theme = useTheme();

  return (
    <View style={styles(theme).container}>
      <Card.Title
        title="Riwayat Transaksi"
        titleVariant="headlineLarge"
        style={{
          paddingLeft: 0,
          minHeight: 0,
          marginBottom: 24,
        }}
        right={() => (
          <Button mode="contained" icon={"tray-arrow-down"}>
            Unduh Laporan
          </Button>
        )}
      />
      <View style={styles(theme).summaryContainer}>
        <Card
          mode="outlined"
          style={{ flex: 1, marginRight: 12 }}
          contentStyle={{
            flex: 1,
            padding: 16,
            justifyContent: "space-between",
          }}
        >
          <Text variant="headlineMedium">Rp500,000</Text>
          <Text variant="bodyMedium">Total Transaksi Hari Ini</Text>
        </Card>
        <View style={{ flex: 1 }}>
          <Card
            mode="outlined"
            style={{
              marginBottom: 12,
            }}
            contentStyle={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="bodySmall">Uang Tunai</Text>
            <Text variant="titleMedium">Rp450,000</Text>
          </Card>
          <Card
            mode="outlined"
            contentStyle={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="bodySmall">QRIS</Text>
            <Text variant="titleMedium">Rp50,000</Text>
          </Card>
        </View>
      </View>
      <Tab.Navigator
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: theme.colors.surface },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          tabBarItemStyle: { width: "auto" },
        }}
      >
        <Tab.Screen name="Semua" component={Screen1} />
        <Tab.Screen name="Uang Tunai" component={Screen1} />
        <Tab.Screen name="QRIS" component={Screen1} />
      </Tab.Navigator>
    </View>
  );
};

export default TransactionsScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
      paddingTop: 44,
      backgroundColor: theme.colors.surface,
      width: "100%",
    },
    summaryContainer: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 24,
    },
  });