import { StyleSheet, View } from "react-native";
import { useTheme, MD3Theme, Text, Button, Card } from "react-native-paper";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CashierItem from "../../components/CashierItem";
import { FlatList } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";

const Tab = createMaterialTopTabNavigator();

const Screen = (props: any) => (
  <FlatList
    contentContainerStyle={{ paddingBottom: 200, paddingTop: 24 }}
    columnWrapperStyle={{ paddingBottom: 12, justifyContent: "space-between" }}
    renderItem={({ item, index }) => (
      <CashierItem
        itemData={item}
        style={[
          { flex: 0.5 },
          index % 2 === 0 ? { marginRight: 16 } : { marginRight: 0 },
        ]}
      />
    )}
    data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
    numColumns={2}
    showsVerticalScrollIndicator={false}
  />
);

const Screen1 = () => <Screen />;
const Screen2 = () => <Screen />;
const Screen3 = () => <Screen />;

export const CashierScreen = ({
  navigation,
}: StackScreenProps<CashierStackParamList, "cashier">) => {
  const theme = useTheme();

  return (
    <View style={styles(theme).container}>
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
        <Tab.Screen name="Etalase 1" component={Screen2} />
        <Tab.Screen name="Etalase 2" component={Screen3} />
      </Tab.Navigator>
      <View style={styles(theme).floatingRecapContainer}>
        <View style={styles(theme).floatingRecap}>
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
            3 Produk • Rp150,000
          </Text>
          <Button
            mode="elevated"
            contentStyle={styles(theme).floatingRecapButton}
            labelStyle={styles(theme).floatingRecapButtonLabel}
            onPress={() => navigation.navigate("summary")}
          >
            Lihat Pesanan
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CashierScreen;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 32,
      width: "100%",
    },
    floatingRecapContainer: {
      position: "absolute",
      alignSelf: "center",
      width: "100%",
      bottom: 0,
      paddingVertical: 28,
    },
    floatingRecap: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: 24,
      paddingVertical: 22,
      height: 72,
    },
    floatingRecapButton: {
      height: 40,
    },
    floatingRecapButtonLabel: {
      fontFamily: theme.fonts.labelLarge.fontFamily,
      fontSize: theme.fonts.labelLarge.fontSize,
      fontStyle: theme.fonts.labelLarge.fontStyle,
      fontWeight: theme.fonts.labelLarge.fontWeight,
    },
    cashierItem: {
      flex: 0.5,
    },
  });
