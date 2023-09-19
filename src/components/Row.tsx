import { View, ViewProps } from "react-native";

const Row = (props: ViewProps) => {
  const { style, children, ...rest } = props;
  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center" }, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Row;
