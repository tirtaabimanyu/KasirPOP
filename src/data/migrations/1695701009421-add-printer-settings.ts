import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrinterSettings1695701009421 implements MigrationInterface {
    name = 'AddPrinterSettings1695701009421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "printer_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "printerName" varchar, "printerIdentifier" varchar, "printerInterfaceType" varchar, "receiptFooter" varchar NOT NULL DEFAULT (''), "paperSize" varchar CHECK( "paperSize" IN ('57','58','80') ) NOT NULL DEFAULT (58), "showLogo" boolean NOT NULL DEFAULT (0), "showQueueNumber" boolean NOT NULL DEFAULT (0))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "printer_settings"`);
    }

}
