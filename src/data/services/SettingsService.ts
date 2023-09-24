import { DataSource, In, Repository } from "typeorm";
import { CategoryModel } from "../entities/CategoryModel";
import {
  CategoryData,
  CombinedSettingsData,
  CreateCategoryData,
  UpdateCategoryData,
  UpdateCombinedSettingsData,
} from "../../types/data";
import { PaymentSettingsModel } from "../entities/PaymentSettingsModel";
import { StoreSettingsModel } from "../entities/StoreSettingsModel";

export type CombinedSettingsModel = {
  storeSettings?: StoreSettingsModel;
  paymentSettings: PaymentSettingsModel;
};

export class SettingsService {
  private storeSettingsRepository: Repository<StoreSettingsModel>;
  private paymentSettingsRepository: Repository<PaymentSettingsModel>;

  constructor(connection: DataSource) {
    this.storeSettingsRepository = connection.getRepository(StoreSettingsModel);
    this.paymentSettingsRepository =
      connection.getRepository(PaymentSettingsModel);
  }

  private async getSettings(): Promise<CombinedSettingsModel> {
    let storeSettings = (await this.storeSettingsRepository.find())[0];

    let paymentSettings = (await this.paymentSettingsRepository.find())[0];
    if (paymentSettings == undefined) {
      paymentSettings = this.paymentSettingsRepository.create();
      paymentSettings = await this.paymentSettingsRepository.save(
        paymentSettings
      );
    }

    return { storeSettings, paymentSettings };
  }

  public async get(): Promise<CombinedSettingsModel> {
    const settings = await this.getSettings();

    return settings;
  }

  public async update(
    data: UpdateCombinedSettingsData
  ): Promise<CombinedSettingsModel> {
    const settings = await this.getSettings();

    const storeSettings = data.storeSettings
      ? await this.storeSettingsRepository.save({
          id: settings.storeSettings?.id,
          ...data.storeSettings,
        })
      : settings.storeSettings;

    const paymentSettings = data.paymentSettings
      ? await this.paymentSettingsRepository.save({
          id: settings.paymentSettings.id,
          ...data.paymentSettings,
        })
      : settings.paymentSettings;

    return { storeSettings, paymentSettings };
  }
}
