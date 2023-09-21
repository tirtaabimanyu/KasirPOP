import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentSettings1695283462638 implements MigrationInterface {
  name = "AddPaymentSettings1695283462638";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "cash" boolean NOT NULL DEFAULT (1), "qris" boolean NOT NULL DEFAULT (0), "qrisImgUri" varchar)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_settings"`);
  }
}
