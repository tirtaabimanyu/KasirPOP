import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migrations1693208647429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const newColumn = new TableColumn({
      name: "imageUrl",
      type: "text",
      isNullable: true,
    });
    await queryRunner.addColumn("products", newColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("products", "imageUrl");
  }
}
