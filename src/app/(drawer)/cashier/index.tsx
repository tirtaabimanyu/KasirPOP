import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, MD3Theme, Text, Button } from "react-native-paper";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router } from "expo-router";

const Tab = createMaterialTopTabNavigator();

const Screen = (props: any) => (
  <ScrollView>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
    <Text>{props.text}</Text>
  </ScrollView>
);

const Screen1 = () => <Screen text="Hello :3" />;
const Screen2 = () => <Screen text="Yellow .__." />;
const Screen3 = () => <Screen text="Mellow T^T" />;

export default function CashierPage() {
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
          // tabBarContentContainerStyle: { paddingHorizontal: 24 },
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
            onPress={() => router.replace("cashier/summary")}
          >
            Lihat Pesanan
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    floatingRecapContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
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
      width: "100%",
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
  });
