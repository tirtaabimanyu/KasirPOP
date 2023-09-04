import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class ProductModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column({ nullable: true })
  imageUrl: string | null;
}
