import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("store_settings")
export class StoreSettingsModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logoImgUri?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;
}
