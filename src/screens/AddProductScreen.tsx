import { StyleSheet, View } from "react-native";
import { Button, Card, MD3Theme, Text, useTheme } from "react-native-paper";
import { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const AddProductScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "addProduct">) => {
  const theme = useTheme();

  return (
    <View style={styles(theme).container}>
      <Card mode="outlined" contentStyle={{ padding: 24 }}>
        <Text>Helo</Text>
      </Card>
    </View>
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
  });
