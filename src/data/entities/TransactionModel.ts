import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PaymentType, ProductSnapshotData } from "../../types/data";

@Entity("transactions")
export class TransactionModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("datetime", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column()
  totalPrice: number;

  @Column()
  moneyReceived: number;

  @Column()
  change: number;

  @Column({
    type: "simple-enum",
    enum: PaymentType,
    default: PaymentType.CASH,
  })
  paymentType: PaymentType;

  @Column("simple-json")
  products: ProductSnapshotData[];

  @Column()
  queueNumber: number;

  @Column({ type: "integer", nullable: true })
  tableNumber?: number | null;
}
