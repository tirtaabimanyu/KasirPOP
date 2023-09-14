import { DataSource, Repository } from "typeorm";
import { ProductCategoryModel } from "../entities/ProductCategoryModel";

interface ICreateProductCategoryData {
  name: string;
}

export class ProductCategoryRepository {
  private ormRepository: Repository<ProductCategoryModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(ProductCategoryModel);
  }

  public async getAll(): Promise<ProductCategoryModel[]> {
    const products = await this.ormRepository.find();

    return products;
  }

  public async create({
    name,
  }: ICreateProductCategoryData): Promise<ProductCategoryModel> {
    const product = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  public async deleteAll(): Promise<void> {
    const products = await this.ormRepository.find();
    await this.ormRepository.remove(products);
  }
}
