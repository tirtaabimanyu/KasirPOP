import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator } from "react-native-paper";
import { DataSource } from "typeorm";

import { AppDataSource } from "./app-data-source";
import { ProductService } from "./services/ProductService";
import { CategoryService } from "./services/CategoryService";
import { StyleSheet, View } from "react-native";
import { DatabaseConnectionContextData } from "../types/connection";
import { TransactionService } from "./services/TransactionService";

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
);

export const DatabaseConnectionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [connection, setConnection] = useState<DataSource | null>(null);

  useEffect(() => {
    const connect = async (dataSource: DataSource) => {
      const createdConnection = await dataSource.initialize();
      setConnection(createdConnection);
    };

    connect(AppDataSource);
    return () => {
      AppDataSource.destroy();
    };
  }, [AppDataSource]);

  if (!connection) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        productService: new ProductService(connection),
        categoryService: new CategoryService(connection),
        transactionService: new TransactionService(connection),
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);

  return context;
}
