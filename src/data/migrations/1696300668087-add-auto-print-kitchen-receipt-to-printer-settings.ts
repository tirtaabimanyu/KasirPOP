import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAutoPrintKitchenReceiptToPrinterSettings1696300668087 implements MigrationInterface {
    name = 'AddAutoPrintKitchenReceiptToPrinterSettings1696300668087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_printer_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "printerName" varchar, "printerIdentifier" varchar, "printerInterfaceType" varchar, "receiptFooter" varchar NOT NULL DEFAULT (''), "paperSize" varchar CHECK( "paperSize" IN ('57','58','80') ) NOT NULL DEFAULT (58), "showLogo" boolean NOT NULL DEFAULT (0), "showQueueNumber" boolean NOT NULL DEFAULT (0), "autoPrintReceipt" boolean NOT NULL DEFAULT (0), "footerLink" varchar NOT NULL DEFAULT (''), "footerLinkAsQR" boolean NOT NULL DEFAULT (0), "autoPrintKitchenReceipt" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_printer_settings"("id", "printerName", "printerIdentifier", "printerInterfaceType", "receiptFooter", "paperSize", "showLogo", "showQueueNumber", "autoPrintReceipt", "footerLink", "footerLinkAsQR") SELECT "id", "printerName", "printerIdentifier", "printerInterfaceType", "receiptFooter", "paperSize", "showLogo", "showQueueNumber", "autoPrintReceipt", "footerLink", "footerLinkAsQR" FROM "printer_settings"`);
        await queryRunner.query(`DROP TABLE "printer_settings"`);
        await queryRunner.query(`ALTER TABLE "temporary_printer_settings" RENAME TO "printer_settings"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "printer_settings" RENAME TO "temporary_printer_settings"`);
        await queryRunner.query(`CREATE TABLE "printer_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "printerName" varchar, "printerIdentifier" varchar, "printerInterfaceType" varchar, "receiptFooter" varchar NOT NULL DEFAULT (''), "paperSize" varchar CHECK( "paperSize" IN ('57','58','80') ) NOT NULL DEFAULT (58), "showLogo" boolean NOT NULL DEFAULT (0), "showQueueNumber" boolean NOT NULL DEFAULT (0), "autoPrintReceipt" boolean NOT NULL DEFAULT (0), "footerLink" varchar NOT NULL DEFAULT (''), "footerLinkAsQR" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "printer_settings"("id", "printerName", "printerIdentifier", "printerInterfaceType", "receiptFooter", "paperSize", "showLogo", "showQueueNumber", "autoPrintReceipt", "footerLink", "footerLinkAsQR") SELECT "id", "printerName", "printerIdentifier", "printerInterfaceType", "receiptFooter", "paperSize", "showLogo", "showQueueNumber", "autoPrintReceipt", "footerLink", "footerLinkAsQR" FROM "temporary_printer_settings"`);
        await queryRunner.query(`DROP TABLE "temporary_printer_settings"`);
    }

}
