import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import Router from "./src/routes";
import store from "./src/redux/store";
import {
  DatabaseConnectionProvider,
  useDatabaseConnection,
} from "./src/data/connection";
import GlobalSnackbar from "./src/components/GlobalSnackbar";
import { useAppDispatch } from "./src/hooks/typedStore";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "./src/redux/slices/productSlice";
import { fetchAllCategories } from "./src/redux/slices/categorySlice";
import { fetchSettings } from "./src/redux/slices/settingsSlice";
import FullscreenSpinner from "./src/components/FullscreenSpinner";
import { fetchQueueNumber } from "./src/redux/slices/transactionSlice";

const DataInit = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const {
    productService,
    categoryService,
    settingsService,
    transactionService,
  } = useDatabaseConnection();

  useEffect(() => {
    const fetch = async () => {
      await dispatch(fetchAllProducts(productService));
      await dispatch(fetchAllCategories(categoryService));
      await dispatch(fetchSettings(settingsService));
      await dispatch(
        fetchQueueNumber({ date: new Date(), service: transactionService })
      );
      setIsReady(true);
    };

    fetch();
  }, []);
  return isReady ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {children}
    </SafeAreaView>
  ) : (
    <FullscreenSpinner />
  );
};

const App = () => {
  return (
    <DatabaseConnectionProvider>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <PaperProvider theme={MD3LightTheme}>
            <DataInit>
              <StatusBar style="auto" />
              <GlobalSnackbar />
              <Router />
            </DataInit>
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </DatabaseConnectionProvider>
  );
};

export default App;
