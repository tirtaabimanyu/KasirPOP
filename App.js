import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import Router from "./src/routes";
import store from "./src/redux/store";
import { DatabaseConnectionProvider } from "./src/data/connection";

export default function App() {
  return (
    <DatabaseConnectionProvider>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar style="auto" />
              <Router />
            </SafeAreaView>
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </DatabaseConnectionProvider>
  );
}
