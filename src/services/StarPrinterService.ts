import {
  InterfaceType,
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
  StarIO10Error,
  StarPrinter,
  StarPrinterModel,
} from "kasirbodoh-star-io10";
import { PermissionsAndroid, Platform } from "react-native";

export type PrinterData = {
  identifier: string;
  interfaceType: string;
  name: string;
  isConnected: boolean;
};

export class StarPrinterService {
  private _discoveryManager?: StarDeviceDiscoveryManager;

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
}
