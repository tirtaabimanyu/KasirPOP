import { CombinedSettingsData } from "../../types/data";
import { CombinedSettingsModel } from "../services/SettingsService";

const SettingsSerializer = class {
  static serialize = (data: CombinedSettingsModel): CombinedSettingsData => ({
    ...(data.storeSettings
      ? {
          storeSettings: {
            name: data.storeSettings.name,
            logoImgUri: data.storeSettings.logoImgUri,
            address: data.storeSettings.address,
            phoneNumber: data.storeSettings.phoneNumber,
          },
        }
      : {}),
    paymentSettings: {
      cash: data.paymentSettings.cash,
      qris: data.paymentSettings.qris,
      qrisImgUri: data.paymentSettings.qrisImgUri,
    },
    printerSettings: {
      printerName: data.printerSettings.printerName,
      printerIdentifier: data.printerSettings.printerIdentifier,
      printerInterfaceType: data.printerSettings.printerInterfaceType,
      receiptFooter: data.printerSettings.receiptFooter,
      paperSize: data.printerSettings.paperSize,
      showLogo: data.printerSettings.showLogo,
      showQueueNumber: data.printerSettings.showQueueNumber,
    },
  });

  static serializeMany = (
    data?: CombinedSettingsModel[]
  ): CombinedSettingsData[] | undefined => {
    const serializedSettings = data?.reduce((obj, settings) => {
      obj.push(this.serialize(settings));
      return obj;
    }, [] as CombinedSettingsData[]);

    return serializedSettings;
  };
};

export default SettingsSerializer;
