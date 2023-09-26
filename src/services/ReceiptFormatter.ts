import PrinterSettings from "../screens/PrinterSettings";
import {
  PaymentType,
  PrinterSettingsData,
  StoreSettingsData,
  TransactionData,
} from "../types/data";
import { toFormattedTime, toRupiah } from "../utils/formatUtils";

export enum ReceiptRowType {
  TEXT = "text",
  LARGE_TEXT = "largeText",
  IMG = "img",
}
export enum ReceiptRowAlign {
  CENTER = "center",
  LEFT = "left",
  RIGHT = "right",
}
export type ReceiptRow = {
  type: ReceiptRowType;
  str: string;
  align?: ReceiptRowAlign;
};

export class ReceiptFormatter {
  private _characterPerLine: { [key: number]: number } = {
    57: 30,
    58: 32,
    80: 48,
  };

  constructor(characterPerLine?: { [key: number]: number }) {
    if (characterPerLine) this._characterPerLine = characterPerLine;
  }

  private lineBreak = (
    charactersPerLine: number,
    paddingCharacter: string = " "
  ) => {
    return `${paddingCharacter.repeat(charactersPerLine)}`;
  };

  private alignLeft = (
    str: string,
    charactersPerLine: number,
    paddingCharacter: string = " "
  ) => {
    const paddingLength = charactersPerLine - str.length;
    return `${str}${paddingCharacter.repeat(paddingLength)}`;
  };

  private alignRight = (
    str: string,
    charactersPerLine: number,
    paddingCharacter: string = " "
  ) => {
    const paddingLength = charactersPerLine - str.length;
    return `${paddingCharacter.repeat(paddingLength)}${str}`;
  };

  private breakWord = (
    str: string,
    breakAt: number,
    align: ReceiptRowAlign = ReceiptRowAlign.CENTER
  ) => {
    const result: string[] = [];

    str.split("\n").forEach((current) => {
      if (current.length == 0) {
        result.push("");
        return;
      }

      let i = 0;
      while (i < current.length) {
        let currentLine = current.substring(i, i + breakAt);
        let rightmostSpace = currentLine.lastIndexOf(" ");
        let brokenLine;
        if (i + breakAt >= current.length) {
          brokenLine = currentLine;
          i = i + breakAt;
        } else if (rightmostSpace == -1) {
          brokenLine = current.substring(i, i + breakAt);
          i = i + breakAt;
        } else {
          brokenLine = current.substring(i, i + rightmostSpace);
          i = i + rightmostSpace + 1;
        }
        if (align == ReceiptRowAlign.LEFT) {
          brokenLine = this.alignLeft(brokenLine, breakAt);
        } else if (align == ReceiptRowAlign.RIGHT) {
          brokenLine = this.alignRight(brokenLine, breakAt);
        }
        result.push(brokenLine);
      }
    });

    return result.join("\n");
  };

  private spaceBetween = (
    str1: string,
    str2: string,
    numOfChars: number,
    paddingCharacter: string = " "
  ) => {
    const paddingLength = numOfChars - str1.length - str2.length;

    return `${str1}${paddingCharacter.repeat(paddingLength)}${str2}`;
  };

  private buildHeader = (
    printerSettings: PrinterSettingsData,
    storeSettings?: StoreSettingsData
  ) => {
    const characterPerLine = this._characterPerLine[printerSettings.paperSize];

    const header: ReceiptRow[] = [];
    if (printerSettings.showLogo)
      header.push(
        ...[
          {
            type: ReceiptRowType.IMG,
            str: storeSettings?.logoImgUri || "",
            align: ReceiptRowAlign.CENTER,
          },
          {
            type: ReceiptRowType.TEXT,
            str: this.lineBreak(characterPerLine),
          },
        ]
      );
    if (storeSettings?.name && storeSettings?.name.length > 0)
      header.push({
        type: ReceiptRowType.TEXT,
        str: this.breakWord(storeSettings.name, characterPerLine),
        align: ReceiptRowAlign.CENTER,
      });
    if (storeSettings?.address && storeSettings?.address.length > 0)
      header.push({
        type: ReceiptRowType.TEXT,
        str: this.breakWord(storeSettings.address, characterPerLine),
        align: ReceiptRowAlign.CENTER,
      });
    if (storeSettings?.phoneNumber && storeSettings?.phoneNumber.length > 0)
      header.push({
        type: ReceiptRowType.TEXT,
        str: this.breakWord(storeSettings.phoneNumber, characterPerLine),
        align: ReceiptRowAlign.CENTER,
      });
    header.push({
      type: ReceiptRowType.TEXT,
      str: this.lineBreak(characterPerLine, "-"),
    });
    return header;
  };

  private buildContent = (
    transaction: TransactionData,
    printerSettings: PrinterSettingsData
  ) => {
    const characterPerLine = this._characterPerLine[printerSettings.paperSize];
    const content: ReceiptRow[] = [];
    if (printerSettings.showQueueNumber)
      content.push({
        type: ReceiptRowType.LARGE_TEXT,
        str: this.breakWord(
          `Antrian ${transaction.queueNumber}`,
          characterPerLine
        ),
        align: ReceiptRowAlign.CENTER,
      });

    content.push({
      type: ReceiptRowType.TEXT,
      str: this.spaceBetween(
        `${new Date(transaction.createdAt).toLocaleDateString("en-gb")}`,
        `${toFormattedTime(new Date(transaction.createdAt))}`,
        characterPerLine
      ),
    });

    content.push({
      type: ReceiptRowType.TEXT,
      str: this.lineBreak(characterPerLine, "-"),
    });

    transaction.products.forEach((product) => {
      content.push({
        type: ReceiptRowType.TEXT,
        str: this.breakWord(
          product.name,
          characterPerLine,
          ReceiptRowAlign.LEFT
        ),
      });
      content.push({
        type: ReceiptRowType.TEXT,
        str: this.spaceBetween(
          `${product.quantity} X @${toRupiah(product.price, false)}`,
          `${toRupiah(product.quantity * product.price)}`,
          characterPerLine
        ),
      });
    });

    content.push({
      type: ReceiptRowType.TEXT,
      str: this.lineBreak(characterPerLine, "-"),
    });

    content.push({
      type: ReceiptRowType.TEXT,
      str: this.breakWord(
        "Total : " +
          this.alignRight(`${toRupiah(transaction.totalPrice, false)}`, 11),
        characterPerLine,
        ReceiptRowAlign.RIGHT
      ),
    });

    content.push({
      type: ReceiptRowType.TEXT,
      str: this.breakWord(
        `${
          transaction.paymentType == PaymentType.CASH ? "Tunai : " : "QRIS : "
        }` +
          this.alignRight(`${toRupiah(transaction.moneyReceived, false)}`, 11),
        characterPerLine,
        ReceiptRowAlign.RIGHT
      ),
    });

    content.push({
      type: ReceiptRowType.TEXT,
      str: this.breakWord(
        "Kembali : " +
          this.alignRight(`${toRupiah(transaction.change, false)}`, 11),
        characterPerLine,
        ReceiptRowAlign.RIGHT
      ),
    });

    return content;
  };

  private buildFooter = (printerSettings: PrinterSettingsData) => {
    const characterPerLine = this._characterPerLine[printerSettings.paperSize];
    const footer = [];

    if (printerSettings.receiptFooter.length > 0)
      footer.push(
        ...[
          {
            type: ReceiptRowType.TEXT,
            str: this.lineBreak(characterPerLine, "-"),
          },
          {
            type: ReceiptRowType.TEXT,
            str: this.breakWord(
              printerSettings.receiptFooter,
              characterPerLine
            ),
            align: ReceiptRowAlign.CENTER,
          },
        ]
      );

    return footer;
  };

  public format(
    transaction: TransactionData,
    printerSettings: PrinterSettingsData,
    storeSettings?: StoreSettingsData
  ) {
    const header = this.buildHeader(printerSettings, storeSettings);
    const content = this.buildContent(transaction, printerSettings);
    const footer = this.buildFooter(printerSettings);

    return [...header, ...content, ...footer];
  }
}
