import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PaperSize } from "../../types/data";

@Entity("printer_settings")
export class PrinterSettingsModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  printerName?: string | null;

  @Column({ nullable: true })
  printerIdentifier?: string | null;

  @Column({ nullable: true })
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
}
