import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
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
import { useEffect } from "react";
import { fetchAllProducts } from "./src/redux/slices/productSlice";
import { fetchAllCategories } from "./src/redux/slices/categorySlice";

const DataInit = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) => {
  const dispatch = useAppDispatch();
  const { productService, categoryService } = useDatabaseConnection();

  useEffect(() => {
    dispatch(fetchAllProducts(productService));
    dispatch(fetchAllCategories(categoryService));
  }, []);
  return <>{children}</>;
};

const App = () => {
  return (
    <DatabaseConnectionProvider>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <PaperProvider>
            <DataInit>
              <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="auto" />
                <GlobalSnackbar />
                <Router />
              </SafeAreaView>
            </DataInit>
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </DatabaseConnectionProvider>
  );
};

export default App;
