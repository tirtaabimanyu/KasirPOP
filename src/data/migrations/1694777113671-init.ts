import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1694777113671 implements MigrationInterface {
    name = 'Init1694777113671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL, "isAlwaysInStock" boolean NOT NULL, "price" integer NOT NULL, "imgUri" varchar)`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "products_categories_categories" ("productsId" integer NOT NULL, "categoriesId" integer NOT NULL, PRIMARY KEY ("productsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40e7da0284a5389344605de8da" ON "products_categories_categories" ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1d833224b5be535323207473f" ON "products_categories_categories" ("categoriesId") `);
        await queryRunner.query(`DROP INDEX "IDX_40e7da0284a5389344605de8da"`);
        await queryRunner.query(`DROP INDEX "IDX_e1d833224b5be535323207473f"`);
        await queryRunner.query(`CREATE TABLE "temporary_products_categories_categories" ("productsId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "FK_40e7da0284a5389344605de8dab" FOREIGN KEY ("productsId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_e1d833224b5be535323207473f1" FOREIGN KEY ("categoriesId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("productsId", "categoriesId"))`);
        await queryRunner.query(`INSERT INTO "temporary_products_categories_categories"("productsId", "categoriesId") SELECT "productsId", "categoriesId" FROM "products_categories_categories"`);
        await queryRunner.query(`DROP TABLE "products_categories_categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_products_categories_categories" RENAME TO "products_categories_categories"`);
        await queryRunner.query(`CREATE INDEX "IDX_40e7da0284a5389344605de8da" ON "products_categories_categories" ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1d833224b5be535323207473f" ON "products_categories_categories" ("categoriesId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e1d833224b5be535323207473f"`);
        await queryRunner.query(`DROP INDEX "IDX_40e7da0284a5389344605de8da"`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" RENAME TO "temporary_products_categories_categories"`);
        await queryRunner.query(`CREATE TABLE "products_categories_categories" ("productsId" integer NOT NULL, "categoriesId" integer NOT NULL, PRIMARY KEY ("productsId", "categoriesId"))`);
        await queryRunner.query(`INSERT INTO "products_categories_categories"("productsId", "categoriesId") SELECT "productsId", "categoriesId" FROM "temporary_products_categories_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_products_categories_categories"`);
        await queryRunner.query(`CREATE INDEX "IDX_e1d833224b5be535323207473f" ON "products_categories_categories" ("categoriesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_40e7da0284a5389344605de8da" ON "products_categories_categories" ("productsId") `);
        await queryRunner.query(`DROP INDEX "IDX_e1d833224b5be535323207473f"`);
        await queryRunner.query(`DROP INDEX "IDX_40e7da0284a5389344605de8da"`);
        await queryRunner.query(`DROP TABLE "products_categories_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
