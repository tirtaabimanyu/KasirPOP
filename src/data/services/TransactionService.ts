import { Between, DataSource, In, Repository } from "typeorm";
import { TransactionModel } from "../entities/TransactionModel";
import { CreateTransactionData, ProductSnapshotData } from "../../types/data";
import { ProductModel } from "../entities/ProductModel";

export class TransactionService {
  private connection: DataSource;
  private transactionRepository: Repository<TransactionModel>;
  private productRepository: Repository<ProductModel>;

  constructor(connection: DataSource) {
    this.connection = connection;
    this.transactionRepository = connection.getRepository(TransactionModel);
    this.productRepository = connection.getRepository(ProductModel);
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
    const transactions = await this.transactionRepository.find(query);

    return transactions;
  }

  public async create(data: CreateTransactionData): Promise<TransactionModel> {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const transactionProducts = data.products.reduce((obj, product) => {
      const { id, name, price, quantity } = product;
      obj[product.id] = { id, name, price, quantity };
      return obj;
    }, {} as { [key: number]: ProductSnapshotData });

    let transaction = await this.transactionRepository.create({
      products: Object.values(transactionProducts),
      total_price: data.totalPrice,
    });

    try {
      const products = await this.productRepository.find({
        where: { id: In(Object.keys(transactionProducts)) },
      });

      products.forEach((product) => {
        product.stock -= transactionProducts[product.id].quantity;
      });

      await this.productRepository.save(products);
      transaction = await this.transactionRepository.save(transaction);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return transaction;
    }
  }
}
