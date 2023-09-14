import { DataSource, MoreThan, Repository } from "typeorm";
import { ProductModel } from "../entities/ProductModel";

interface ICreateProductData {
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
}

export class ProductRepository {
  private ormRepository: Repository<ProductModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(ProductModel);
  }

  public async getAll(): Promise<ProductModel[]> {
    const products = await this.ormRepository.find();

    return products;
  }

  public async getAllInStock(): Promise<ProductModel[]> {
    const products = await this.ormRepository.find({
      where: [{ isAlwaysInStock: true }, { stock: MoreThan(0) }],
    });

    return products;
  }

  public async getAllOutOfStock(): Promise<ProductModel[]> {
    const products = await this.ormRepository.find({
      where: [{ isAlwaysInStock: false, stock: MoreThan(0) }],
    });

    return products;
  }

  public async create({
    name,
    stock,
    isAlwaysInStock,
    price,
    imgUri,
  }: ICreateProductData): Promise<ProductModel> {
    const product = this.ormRepository.create({
      name,
      stock,
      isAlwaysInStock,
      price,
      imgUri,
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
