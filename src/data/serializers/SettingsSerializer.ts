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
