import { StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";

type FloatingRecapProps = {
  contentText: string;
  buttonText: string;
  onPressButton: () => void;
};

const FloatingRecap = (props: FloatingRecapProps) => {
  const theme = useTheme();
  return (
    <View style={styles(theme).floatingRecapContainer}>
      <View style={styles(theme).floatingRecap}>
        <Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
          {props.contentText}
        </Text>
        <Button
          mode="elevated"
          contentStyle={styles(theme).floatingRecapButton}
          labelStyle={styles(theme).floatingRecapButtonLabel}
          onPress={props.onPressButton}
        >
          {props.buttonText}
        </Button>
      </View>
    </View>
  );
};

export default FloatingRecap;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
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
      ...theme.fonts.labelLarge,
    },
  });
