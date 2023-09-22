import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { TransactionModel } from "./entities/TransactionModel";
import { PaymentSettingsModel } from "./entities/PaymentSettingsModel";
import { StoreSettingsModel } from "./entities/StoreSettingsModel";

import { InitDatabase1695274534011 } from "./migrations/1695274534011-init-database";
import { AddPaymentSettings1695283462638 } from "./migrations/1695283462638-add-payment-settings";
import { AddStoreSettings1695372133911 } from "./migrations/1695372133911-add-store-settings";

export const CommonDataSourceOptions = {
  entities: [
    ProductModel,
    CategoryModel,
    TransactionModel,
    PaymentSettingsModel,
    StoreSettingsModel,
  ],
  migrations: [
    InitDatabase1695274534011,
    AddPaymentSettings1695283462638,
    AddStoreSettings1695372133911,
  ],
};
