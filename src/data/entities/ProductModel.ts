import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CategoryModel } from "./CategoryModel";

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

  @Column({ nullable: true })
  imgUri?: string;

  @ManyToMany(() => CategoryModel)
  @JoinTable()
  categories: CategoryModel[];
}
