import { ProductModel } from "./entities/ProductModel";
import { CategoryModel } from "./entities/CategoryModel";
import { TransactionModel } from "./entities/TransactionModel";
import { PaymentSettingsModel } from "./entities/PaymentSettingsModel";
import { StoreSettingsModel } from "./entities/StoreSettingsModel";
import { PrinterSettingsModel } from "./entities/PrinterSettingsModel";

import { InitDatabase1695274534011 } from "./migrations/1695274534011-init-database";
import { AddPaymentSettings1695283462638 } from "./migrations/1695283462638-add-payment-settings";
import { AddStoreSettings1695372133911 } from "./migrations/1695372133911-add-store-settings";
import { AddReceiptDetailsToTransactions1695539034773 } from "./migrations/1695539034773-add-receipt-details-to-transactions";
import { AddPrinterSettings1695724577465 } from "./migrations/1695724577465-add-printer-settings";
import { AddLinksToReceiptFooter1696175688638 } from "./migrations/1696175688638-add-links-to-receipt-footer";
import { AddTableNumberToTransactions1696300430416 } from "./migrations/1696300430416-add-table-number-to-transactions";
import { AddAutoPrintKitchenReceiptToPrinterSettings1696300668087 } from "./migrations/1696300668087-add-auto-print-kitchen-receipt-to-printer-settings";

export const CommonDataSourceOptions = {
  entities: [
    ProductModel,
    CategoryModel,
    TransactionModel,
    PaymentSettingsModel,
    StoreSettingsModel,
    PrinterSettingsModel,
  ],
  migrations: [
    InitDatabase1695274534011,
    AddPaymentSettings1695283462638,
    AddStoreSettings1695372133911,
    AddReceiptDetailsToTransactions1695539034773,
    AddPrinterSettings1695724577465,
    AddLinksToReceiptFooter1696175688638,
    AddTableNumberToTransactions1696300430416,
    AddAutoPrintKitchenReceiptToPrinterSettings1696300668087,
  ],
};
