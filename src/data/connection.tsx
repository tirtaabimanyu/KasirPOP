import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator } from "react-native-paper";
import { DataSource } from "typeorm";

import { AppDataSource } from "./app-data-source";
import { ProductsRepository } from "./repositories/ProductsRepository";
import { StyleSheet, View } from "react-native";

interface DatabaseConnectionContextData {
  productsRepository: ProductsRepository;
}

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
        productsRepository: new ProductsRepository(connection),
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
