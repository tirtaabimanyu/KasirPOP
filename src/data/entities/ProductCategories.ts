import { Entity, JoinTable, OneToOne, PrimaryColumn } from "typeorm";
import { ProductModel } from "./ProductModel";
import { CategoryModel } from "./CategoryModel";

@Entity("product_categories")
export class ProductCategories {
  @PrimaryColumn({ type: "int" })
  product_id: number;

  @PrimaryColumn({ type: "int" })
  category_id: number;

  @OneToOne(() => ProductModel)
  @JoinTable()
  product: ProductModel;

  @OneToOne(() => CategoryModel)
  @JoinTable()
  category: CategoryModel;
}
