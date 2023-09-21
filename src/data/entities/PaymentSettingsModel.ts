import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment_settings")
export class PaymentSettingsModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ default: true })
  cash: boolean;

  @Column({ default: false })
  qris: boolean;

  @Column({ nullable: true })
  qrisImgUri?: string;
}
