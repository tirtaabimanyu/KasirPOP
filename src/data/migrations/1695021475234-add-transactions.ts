import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactions1695021475234 implements MigrationInterface {
    name = 'AddTransactions1695021475234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "total_price" integer NOT NULL, "products" text NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
