import { getHeaderTitle } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const DrawerHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      <Text>Hello</Text>
    </View>
  );
};

export default DrawerHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "red",
  },
});
