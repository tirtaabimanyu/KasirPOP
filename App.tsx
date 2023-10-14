import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme, useTheme } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
import { View } from "react-native";
import { unlockAsync } from "expo-screen-orientation";
import useCheckOrientation from "./src/hooks/useCheckOrientation";
import { updateOrientation } from "./src/redux/slices/layoutSlice";

const Init = () => {
  const theme = useTheme();
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

    unlockAsync();
    fetch();
  }, []);

  const orientation = useCheckOrientation();

  useEffect(() => {
    dispatch(updateOrientation(orientation));
  }, [orientation]);

  const insets = useSafeAreaInsets();
  return isReady ? (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.colors.primary,
      }}
    >
      <StatusBar style={"light"} backgroundColor={theme.colors.primary} />
      <GlobalSnackbar />
      <Router />
    </View>
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
            <Init />
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </DatabaseConnectionProvider>
  );
};

export default App;
