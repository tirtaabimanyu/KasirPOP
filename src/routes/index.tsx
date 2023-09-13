import {
  NavigationContainer,
  NavigationContainerProps,
} from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { MD3Theme, useTheme, IconButton, Text } from "react-native-paper";
import { enableFreeze, enableScreens } from "react-native-screens";
import { SummaryScreen, PaymentScreen } from "../screens/Cashier";
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { ParamListBase, Route } from "@react-navigation/native";
import HomeDrawer from "./HomeDrawer";

enableScreens();
enableFreeze();
const Stack = createNativeStackNavigator<RootStackParamList>();

type HeaderProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string>;
  options: NativeStackNavigationOptions;
  back?: { title: string };
  theme: MD3Theme;
};

const Header = ({ theme, options, navigation, back }: HeaderProps) => {
  return (
    <View style={styles(theme).header}>
      {back && (
        <IconButton
          icon="arrow-left"
          size={24}
          style={styles(theme).headerBackButton}
          onPress={navigation.goBack}
        />
      )}
      <Text variant="headlineLarge">{options.title}</Text>
    </View>
  );
};

const Router = (props: NavigationContainerProps) => {
  const theme = useTheme();
  return (
    <NavigationContainer {...props}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: styles(theme).card,
          header: (props) => <Header {...props} theme={theme} />,
        }}
      >
        <Stack.Screen
          name="home"
          component={HomeDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="summary"
          component={SummaryScreen}
          options={{ title: "Ringkasan Pesanan" }}
        />
        <Stack.Screen
          name="payment"
          component={PaymentScreen}
          options={{ title: "Pembayaran" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
    },
    header: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
    headerBackButton: {
      width: "auto",
      height: "auto",
      alignSelf: "center",
      margin: 0,
      marginRight: 16,
    },
  });
