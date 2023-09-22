import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreSettings1695372133911 implements MigrationInterface {
    name = 'AddStoreSettings1695372133911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "logoImgUri" varchar, "address" varchar, "phoneNumber" varchar)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "store_settings"`);
    }

}
