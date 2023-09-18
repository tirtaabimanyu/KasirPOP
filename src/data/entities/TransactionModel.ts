import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProductSnapshotData } from "../../types/data";

@Entity("transactions")
export class TransactionModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("datetime", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column()
  total_price: number;

  @Column("simple-json")
  products: ProductSnapshotData[];
}
