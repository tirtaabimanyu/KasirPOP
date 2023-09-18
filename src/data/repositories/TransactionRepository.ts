import { Between, DataSource, In, Repository } from "typeorm";
import { TransactionModel } from "../entities/TransactionModel";
import { CreateTransactionData } from "../../types/data";

export class TransactionRepository {
  private ormRepository: Repository<TransactionModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(TransactionModel);
  }

  public async getAll(dateRange?: {
    start: Date;
    end: Date;
  }): Promise<TransactionModel[]> {
    let query = undefined;
    if (dateRange)
      query = {
        where: { created_at: Between(dateRange.start, dateRange.end) },
      };
    const transactions = await this.ormRepository.find(query);

    return transactions;
  }

  public async create(data: CreateTransactionData): Promise<TransactionModel> {
    const category = this.ormRepository.create(data);

    return category;
  }
}
