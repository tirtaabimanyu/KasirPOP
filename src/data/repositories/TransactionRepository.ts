import { DataSource, In, Repository } from "typeorm";
import { TransactionModel } from "../entities/TransactionModel";
import { CreateTransactionData } from "../../types/data";

export class TransactionRepository {
  private ormRepository: Repository<TransactionModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(TransactionModel);
  }

  public async create(data: CreateTransactionData): Promise<TransactionModel> {
    const category = this.ormRepository.create(data);

    return category;
  }
}
