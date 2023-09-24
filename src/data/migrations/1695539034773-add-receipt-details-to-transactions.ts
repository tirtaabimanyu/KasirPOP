import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReceiptDetailsToTransactions1695539034773
  implements MigrationInterface
{
  name = "AddReceiptDetailsToTransactions1695539034773";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_transactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "totalPrice" integer NOT NULL, "paymentType" varchar CHECK( "paymentType" IN ('cash','qris') ) NOT NULL DEFAULT ('cash'), "products" text NOT NULL, "moneyReceived" integer NOT NULL, "change" integer NOT NULL, "queueNumber" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transactions"("id", "createdAt", "totalPrice", "paymentType", "products") SELECT "id", "createdAt", "totalPrice", "paymentType", "products" FROM "transactions"`
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transactions" RENAME TO "transactions"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME TO "temporary_transactions"`
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "totalPrice" integer NOT NULL, "paymentType" varchar CHECK( "paymentType" IN ('cash','qris') ) NOT NULL DEFAULT ('cash'), "products" text NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "transactions"("id", "createdAt", "totalPrice", "paymentType", "products") SELECT "id", "createdAt", "totalPrice", "paymentType", "products" FROM "temporary_transactions"`
    );
    await queryRunner.query(`DROP TABLE "temporary_transactions"`);
  }
}
