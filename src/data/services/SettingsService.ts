import { DataSource, Repository } from "typeorm";
import { UpdateCombinedSettingsData } from "../../types/data";
import { PaymentSettingsModel } from "../entities/PaymentSettingsModel";
import { StoreSettingsModel } from "../entities/StoreSettingsModel";
import { PrinterSettingsModel } from "../entities/PrinterSettingsModel";

export type CombinedSettingsModel = {
  storeSettings?: StoreSettingsModel;
  paymentSettings: PaymentSettingsModel;
  printerSettings: PrinterSettingsModel;
};

export class SettingsService {
  private storeSettingsRepository: Repository<StoreSettingsModel>;
  private paymentSettingsRepository: Repository<PaymentSettingsModel>;
  private printerSettingsRepository: Repository<PrinterSettingsModel>;

  constructor(connection: DataSource) {
    this.storeSettingsRepository = connection.getRepository(StoreSettingsModel);
    this.paymentSettingsRepository =
      connection.getRepository(PaymentSettingsModel);
    this.printerSettingsRepository =
      connection.getRepository(PrinterSettingsModel);
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

    let printerSettings = (await this.printerSettingsRepository.find())[0];
    if (printerSettings == undefined) {
      printerSettings = this.printerSettingsRepository.create();
      printerSettings = await this.printerSettingsRepository.save(
        printerSettings
      );
    }

    return { storeSettings, paymentSettings, printerSettings };
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

    const printerSettings = data.printerSettings
      ? await this.printerSettingsRepository.save({
          id: settings.printerSettings.id,
          ...data.printerSettings,
        })
      : settings.printerSettings;

    return { storeSettings, paymentSettings, printerSettings };
  }
}
