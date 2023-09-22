import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const FullscreenSpinner = () => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default FullscreenSpinner;
