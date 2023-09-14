import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product_categories")
export class ProductCategoryModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;
}
