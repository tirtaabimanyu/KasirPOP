import { Connection, Repository } from "typeorm";
import { ProductModel } from "../entities/ProductModel";

interface ICreateProductData {
  name: string;
  stock: number;
}

export class ProductsRepository {
  private ormRepository: Repository<ProductModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(ProductModel);
  }

  public async getAll(): Promise<ProductModel[]> {
    const todos = await this.ormRepository.find();

    return todos;
  }

  public async create({
    name,
    stock,
  }: ICreateProductData): Promise<ProductModel> {
    const todo = this.ormRepository.create({
      name,
      stock,
    });

    await this.ormRepository.save(todo);

    return todo;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
