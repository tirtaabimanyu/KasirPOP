import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { CategoryModel } from "./CategoryModel";

@Entity("products")
export class ProductModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  isAlwaysInStock: boolean;

  @Column()
  price: number;

  @Column({ type: "varchar", nullable: true })
  imgUri?: string | null;

  @ManyToMany("CategoryModel", "products", {
    cascade: true,
  })
  @JoinTable()
  categories: Relation<CategoryModel[]>;
}
