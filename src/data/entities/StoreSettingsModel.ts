import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("store_settings")
export class StoreSettingsModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ type: "varchar", nullable: true })
  logoImgUri?: string | null;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;
}
