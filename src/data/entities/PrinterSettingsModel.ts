import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PaperSize } from "../../types/data";

@Entity("printer_settings")
export class PrinterSettingsModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", nullable: true })
  printerName?: string | null;

  @Column({ type: "varchar", nullable: true })
  printerIdentifier?: string | null;

  @Column({ type: "varchar", nullable: true })
  printerInterfaceType?: string | null;

  @Column({ default: "" })
  receiptFooter: string;

  @Column({
    type: "simple-enum",
    enum: PaperSize,
    default: PaperSize.FIFTY_EIGHT,
  })
  paperSize: number;

  @Column({ default: false })
  showLogo: boolean;

  @Column({ default: false })
  showQueueNumber: boolean;

  @Column({ default: false })
  autoPrintReceipt: boolean;

  @Column({ default: false })
  autoPrintKitchenReceipt: boolean;

  @Column({ default: "" })
  footerLink: string;

  @Column({ default: false })
  footerLinkAsQR: boolean;
}
