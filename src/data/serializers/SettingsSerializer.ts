import { CombinedSettingsData, PaymentSettingsData } from "../../types/data";
import { PaymentSettingsModel } from "../entities/PaymentSettingsModel";
import { CombinedSettingsModel } from "../services/SettingsService";

const SettingsSerializer = class {
  static serialize = (data: CombinedSettingsModel): CombinedSettingsData => ({
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
