import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { CashierStackParamList } from "../../routes/CashierStack";

type SummaryScreenProps = StackScreenProps<CashierStackParamList, "summary">;

export default function SummaryScreen(props: SummaryScreenProps) {
  return (
    <View>
      <Text>Hello</Text>
      <Button onPress={() => props.navigation.navigate("payment")}>
        Bayar
      </Button>
    </View>
  );
}
