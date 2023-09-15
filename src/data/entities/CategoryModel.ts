import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { ProductModel } from "./ProductModel";

@Entity("categories")
export class CategoryModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @ManyToMany("ProductModel", "categories")
  products: Relation<ProductModel[]>;
}
