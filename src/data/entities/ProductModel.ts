import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductCategoryModel } from "./ProductCategoryModel";
import { ImageSourcePropType } from "react-native";

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
  imgUri?: ImageSourcePropType;

  @ManyToMany(() => ProductCategoryModel)
  @JoinTable()
  categories: ProductCategoryModel[];
}
