import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories")
export class CategoryModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;
}
