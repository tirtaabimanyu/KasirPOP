import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableNumberToTransactions1696300430416 implements MigrationInterface {
    name = 'AddTableNumberToTransactions1696300430416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "totalPrice" integer NOT NULL, "paymentType" varchar CHECK( "paymentType" IN ('cash','qris') ) NOT NULL DEFAULT ('cash'), "products" text NOT NULL, "moneyReceived" integer NOT NULL, "change" integer NOT NULL, "queueNumber" integer NOT NULL, "tableNumber" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "createdAt", "totalPrice", "paymentType", "products", "moneyReceived", "change", "queueNumber") SELECT "id", "createdAt", "totalPrice", "paymentType", "products", "moneyReceived", "change", "queueNumber" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "totalPrice" integer NOT NULL, "paymentType" varchar CHECK( "paymentType" IN ('cash','qris') ) NOT NULL DEFAULT ('cash'), "products" text NOT NULL, "moneyReceived" integer NOT NULL, "change" integer NOT NULL, "queueNumber" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "createdAt", "totalPrice", "paymentType", "products", "moneyReceived", "change", "queueNumber") SELECT "id", "createdAt", "totalPrice", "paymentType", "products", "moneyReceived", "change", "queueNumber" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
    }

}
