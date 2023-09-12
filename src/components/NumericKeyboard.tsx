import {
  Pressable,
  PressableAndroidRippleConfig,
  StyleSheet,
  View,
} from "react-native";
import { Card, MD3Theme, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";
import { StyleProps } from "react-native-reanimated";

type textKey = {
  label: string;
  variant: VariantProp<never>;
};
const isTextKey = (x: any): x is textKey =>
  x.label !== undefined && x.variant !== undefined;

type iconKey = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  size: number;
};
const isIconKey = (x: any): x is textKey =>
  x.name !== undefined && x.size !== undefined;

type Key = {
  value: string;
  component: textKey | iconKey;
};
const keyArray: (Key | null)[][] = [
  [
    { value: "1", component: { label: "1", variant: "headlineLarge" } },
    { value: "2", component: { label: "2", variant: "headlineLarge" } },
    { value: "3", component: { label: "3", variant: "headlineLarge" } },
    { value: "clear", component: { label: "C", variant: "headlineLarge" } },
  ],
  [
    { value: "4", component: { label: "4", variant: "headlineLarge" } },
    { value: "5", component: { label: "5", variant: "headlineLarge" } },
    { value: "6", component: { label: "6", variant: "headlineLarge" } },
    { value: "backspace", component: { name: "backspace", size: 32 } },
  ],
  [
    { value: "7", component: { label: "7", variant: "headlineLarge" } },
    { value: "8", component: { label: "8", variant: "headlineLarge" } },
    { value: "9", component: { label: "9", variant: "headlineLarge" } },
    {
      value: "exact",
      component: { label: "Uang\nPas", variant: "titleLarge" },
    },
  ],
  [
    { value: "0", component: { label: "0", variant: "headlineLarge" } },
    { value: "000", component: { label: "000", variant: "headlineLarge" } },
    null,
    null,
  ],
];

type NumericKeyboardProps = {
  onKeyPress: (value: string) => void;
  style?: StyleProps;
  contentStyle?: StyleProps;
  rippleConfig?: PressableAndroidRippleConfig;
};
const NumericKeyboard = ({
  onKeyPress,
  style,
  contentStyle,
  rippleConfig,
}: NumericKeyboardProps) => {
  const theme = useTheme();

  return (
    <Card
      mode="outlined"
      style={[styles(theme).card, style]}
      contentStyle={[styles(theme).cardContent, contentStyle]}
    >
      {keyArray.map((row, rowIdx) => (
        <View style={styles(theme).keyRow} key={"row-" + rowIdx}>
          {row.map((key, keyIdx) => {
            if (key === null) {
              return (
                <View style={styles(theme).keyButton} key={"key-" + keyIdx} />
              );
            }

            const keyComponent = isTextKey(key.component) ? (
              <Text variant={key.component.variant}>{key.component.label}</Text>
            ) : (
              <MaterialCommunityIcons
                name={key.component.name}
                size={key.component.size}
              />
            );

            return (
              <Pressable
                style={styles(theme).keyButton}
                android_ripple={{ ...styles(theme).keyRipple, ...rippleConfig }}
                onPress={() => onKeyPress(key.value)}
              >
                {keyComponent}
              </Pressable>
            );
          })}
        </View>
      ))}
    </Card>
  );
};

export default NumericKeyboard;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: { aspectRatio: 1 },
    cardContent: { flex: 1 },
    keyRow: { flex: 1, flexDirection: "row" },
    keyButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    keyRipple: {
      color: theme.colors.primaryContainer,
    },
  });
