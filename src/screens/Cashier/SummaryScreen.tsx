import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import CashierItem from "../../components/CashierItem";
import { FlatList } from "react-native-gesture-handler";

const RowSeparator = () => <View style={{ height: 12 }} />;

type SummaryScreenProps = StackScreenProps<CashierStackParamList, "summary">;
const SummaryScreen = ({ navigation }: SummaryScreenProps) => {
  const theme = useTheme();
  return (
    <View style={styles(theme).container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 200, paddingTop: 24 }}
        renderItem={({ item, index }) => <CashierItem itemData={item} />}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={RowSeparator}
      />
      <View style={styles(theme).floatingRecapContainer}>
        <View style={styles(theme).floatingRecap}>
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
            Total Rp150,000
          </Text>
          <Button
            mode="elevated"
            contentStyle={styles(theme).floatingRecapButton}
            labelStyle={styles(theme).floatingRecapButtonLabel}
            onPress={() => navigation.navigate("payment")}
          >
            Bayar
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SummaryScreen;

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
  });
