import {
  InterfaceType,
  StarConnectionSettings,
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
  StarIO10Error,
  StarPrinter,
  StarPrinterModel,
  StarXpandCommand,
} from "kasirbodoh-star-io10";
import { PermissionsAndroid, Platform } from "react-native";
import {
  PaymentType,
  PrinterSettingsData,
  StoreSettingsData,
  TransactionData,
} from "../types/data";
import {
  ReceiptFormatter,
  ReceiptRowAlign,
  ReceiptRowType,
} from "./ReceiptFormatter";

export type PrinterData = {
  identifier: string;
  interfaceType: string;
  name: string;
  isConnected: boolean;
};

export class StarPrinterService {
  private _discoveryManager?: StarDeviceDiscoveryManager;
  private _defaultAlignment = StarXpandCommand.Printer.Alignment.Right;

  private async _confirmBluetoothPermission(): Promise<boolean> {
    let hasPermission = false;

    try {
      hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );

        hasPermission = status == PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
    }

    return hasPermission;
  }

  async getPrinterData(printer: StarPrinter): Promise<PrinterData | undefined> {
    let isConnected = false;
    try {
      await printer.open();
      isConnected = true;
    } catch (error) {
      if (error instanceof StarIO10Error) {
        isConnected = false;
      }
    } finally {
      await printer.close();
      return {
        identifier: printer.connectionSettings.identifier,
        interfaceType: printer.connectionSettings.interfaceType,
        name: printer.information?.model || StarPrinterModel.Unknown,
        isConnected,
      };
    }
  }

  async startDiscovery(
    onPrinterFound: (printerData: PrinterData) => void,
    onDiscoveryFinished?: () => void,
    onError?: (error: string) => void
  ) {
    if (Platform.OS == "android" && 31 <= Platform.Version) {
      let hasPermission = await this._confirmBluetoothPermission();

      if (!hasPermission) {
        console.log(
          `PERMISSION ERROR: You have to allow Nearby devices to use the Bluetooth printer`
        );
        return;
      }
    }

    try {
      await this.stopDiscovery();

      this._discoveryManager = await StarDeviceDiscoveryManagerFactory.create([
        InterfaceType.Bluetooth,
        InterfaceType.Lan,
        InterfaceType.Usb,
      ]);
      this._discoveryManager.discoveryTime = 10000;
      this._discoveryManager.onPrinterFound = async (printer: StarPrinter) => {
        const printerData = await this.getPrinterData(printer);
        if (printerData != undefined) onPrinterFound(printerData);
      };

      if (onDiscoveryFinished)
        this._discoveryManager.onDiscoveryFinished = onDiscoveryFinished;

      await this._discoveryManager.startDiscovery();
    } catch (error) {
      onError && onError(String(error));
    }
  }

  async stopDiscovery() {
    await this._discoveryManager?.stopDiscovery();
  }

  async printReceipt(
    transaction: TransactionData,
    printerSettings: PrinterSettingsData,
    storeSettings?: StoreSettingsData
  ) {
    var settings = new StarConnectionSettings();
    settings.interfaceType =
      printerSettings.printerInterfaceType as InterfaceType;
    settings.identifier = printerSettings.printerIdentifier || "";

    if (Platform.OS == "android" && 31 <= Platform.Version) {
      let hasPermission = await this._confirmBluetoothPermission();

      if (!hasPermission) {
        console.log(
          `PERMISSION ERROR: You have to allow Nearby devices to use the Bluetooth printer`
        );
        return;
      }
    }

    var printer = new StarPrinter(settings);

    try {
      let commandBuilder = new StarXpandCommand.StarXpandCommandBuilder();
      let documentBuilder = new StarXpandCommand.DocumentBuilder();
      if (transaction.paymentType == PaymentType.CASH)
        documentBuilder.addDrawer(
          new StarXpandCommand.DrawerBuilder().actionOpen(
            new StarXpandCommand.Drawer.OpenParameter().setChannel(
              StarXpandCommand.Drawer.Channel.No1
            )
          )
        );

      let printerBuilder = new StarXpandCommand.PrinterBuilder()
        .styleInternationalCharacter(
          StarXpandCommand.Printer.InternationalCharacterType.Usa
        )
        .styleCharacterSpace(0)
        .styleAlignment(StarXpandCommand.Printer.Alignment.Center);

      const receiptRows = new ReceiptFormatter().format(
        transaction,
        printerSettings,
        storeSettings
      );
      receiptRows.forEach((row) => {
        if (row.align == ReceiptRowAlign.CENTER) {
          printerBuilder = printerBuilder.styleAlignment(
            StarXpandCommand.Printer.Alignment.Center
          );
        } else if (row.align == ReceiptRowAlign.LEFT) {
          printerBuilder = printerBuilder.styleAlignment(
            StarXpandCommand.Printer.Alignment.Left
          );
        } else if (row.align == ReceiptRowAlign.RIGHT) {
          printerBuilder = printerBuilder.styleAlignment(
            StarXpandCommand.Printer.Alignment.Right
          );
        }

        if (row.type == ReceiptRowType.TEXT) {
          printerBuilder = printerBuilder.actionPrintText(row.str + "\n");
        } else if (row.type == ReceiptRowType.LARGE_TEXT) {
          printerBuilder = printerBuilder.add(
            new StarXpandCommand.PrinterBuilder()
              .styleMagnification(
                new StarXpandCommand.MagnificationParameter(2, 2)
              )
              .actionPrintText(row.str + "\n")
          );
        } else if (row.type == ReceiptRowType.IMG) {
          printerBuilder = printerBuilder.actionPrintImage(
            new StarXpandCommand.Printer.ImageParameter(row.str, 200)
          );
        } else if (row.type == ReceiptRowType.QR) {
          printerBuilder = printerBuilder.actionPrintQRCode(
            new StarXpandCommand.Printer.QRCodeParameter(row.str)
              .setModel(StarXpandCommand.Printer.QRCodeModel.Model2)
              .setLevel(StarXpandCommand.Printer.QRCodeLevel.L)
              .setCellSize(8)
          );
        }
        if (row.align != undefined)
          printerBuilder = printerBuilder.styleAlignment(
            this._defaultAlignment
          );
      });
      printerBuilder.actionCut(StarXpandCommand.Printer.CutType.Partial);

      documentBuilder.addPrinter(printerBuilder);
      commandBuilder.addDocument(documentBuilder);
      var commands = await commandBuilder.getCommands();

      await printer.open();
      await printer.print(commands);

      console.log("Success");
    } catch (error) {
      throw error;
    } finally {
      await printer.close();
      await printer.dispose();
    }
  }
}
