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

export type CombinedSettingsModel = {
  paymentSettings: PaymentSettingsModel;
};

export class SettingsService {
  private paymentSettingsRepository: Repository<PaymentSettingsModel>;

  constructor(connection: DataSource) {
    this.paymentSettingsRepository =
      connection.getRepository(PaymentSettingsModel);
  }

  private async getSettings(): Promise<CombinedSettingsModel> {
    let paymentSettings = (await this.paymentSettingsRepository.find())[0];
    if (paymentSettings == undefined) {
      paymentSettings = this.paymentSettingsRepository.create();
      paymentSettings = await this.paymentSettingsRepository.save(
        paymentSettings
      );
    }

    return { paymentSettings };
  }

  public async get(): Promise<CombinedSettingsModel> {
    const settings = await this.getSettings();

    return settings;
  }

  public async update(
    data: UpdateCombinedSettingsData
  ): Promise<CombinedSettingsModel> {
    const settings = await this.getSettings();

    const paymentSettings = await this.paymentSettingsRepository.save({
      id: settings.paymentSettings.id,
      ...data.paymentSettings,
    });

    return { paymentSettings };
  }
}
