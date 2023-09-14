import { Table, MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1692982176634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "text",
          },
          {
            name: "stock",
            type: "integer",
          },
          {
            name: "isAlwaysInStock",
            type: "boolean",
          },
          {
            name: "price",
            type: "integer",
          },
          {
            name: "imgUri",
            type: "string",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
