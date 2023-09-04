import React from "react";
import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

interface DrawerContentProps {
  state: any;
  navigation: any;
  descriptors: any;
}

interface IconProps {
  color: string;
  size: number;
}

const DrawerContent: React.FC<DrawerContentProps> = (props) => {
  const drawerItems = [
    { label: "Kasir", icon: "account-outline", route: "cashier" },
    { label: "Inventori", icon: "tune", route: "inventory" },
    {
      label: "Riwayat Transaksi",
      icon: "bookmark-outline",
      route: "transactions",
    },
    { label: "Pengaturan", icon: "cog", route: "settings" },
  ];
  return (
    <View style={styles.drawerContent}>
      <Drawer.Section style={styles.drawerSection} showDivider={false}>
        {drawerItems.map((item, idx) => {
          const isActive = props.state.index == idx;
          return (
            <Drawer.CollapsedItem
              key={"drawerItem-" + item.label}
              focusedIcon={item.icon}
              label={item.label}
              onPress={() => {
                router.push(item.route);
              }}
              active={isActive}
            />
          );
        })}
      </Drawer.Section>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontWeight: "bold",
  },
  drawerSection: {
    marginTop: 15,
  },
});
