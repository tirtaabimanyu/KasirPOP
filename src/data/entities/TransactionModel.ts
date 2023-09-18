import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PaymentType, ProductSnapshotData } from "../../types/data";

@Entity("transactions")
export class TransactionModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("datetime", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column()
  total_price: number;

  @Column({
    type: "simple-enum",
    enum: PaymentType,
    default: PaymentType.CASH,
  })
  payment_type: PaymentType;

  @Column("simple-json")
  products: ProductSnapshotData[];
}
