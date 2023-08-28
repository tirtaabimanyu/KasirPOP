import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator } from "react-native";
import { Connection, createConnection } from "typeorm";

import { ProductModel } from "./entities/ProductModel";
import { Migrations1692982176634 } from "./migrations/1692982176634-migrations";
import { ProductsRepository } from "./repositories/ProductsRepository";

interface DatabaseConnectionContextData {
  productsRepository: ProductsRepository;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
);

export const DatabaseConnectionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connect = useCallback(async () => {
    const createdConnection = await createConnection({
      type: "expo",
      database: "db.db",
      driver: require("expo-sqlite"),
      entities: [ProductModel],

      migrations: [Migrations1692982176634],
      migrationsRun: true,

      synchronize: false,
    });

    setConnection(createdConnection);
  }, []);

  useEffect(() => {
    if (!connection) {
      connect();
    }
  }, [connect, connection]);

  if (!connection) {
    return <ActivityIndicator />;
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
