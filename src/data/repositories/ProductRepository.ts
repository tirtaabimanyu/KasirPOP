import { DataSource, Repository } from "typeorm";
import { ProductModel } from "../entities/ProductModel";

export class ProductRepository {
  private ormRepository: Repository<ProductModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(ProductModel);
  }

  public async getAll(): Promise<ProductModel[]> {
    const products = await this.ormRepository.find({
      relations: {
        categories: true,
      },
    });

    return products;
  }

  public async create({
    name,
    stock,
    isAlwaysInStock,
    price,
    imgUri,
    categories,
  }: CreateProductData): Promise<ProductModel> {
    const product = this.ormRepository.create({
      name,
      stock,
      isAlwaysInStock,
      price,
      imgUri,
    });
    if (categories != undefined) {
      product.categories = categories;
    }
    await this.ormRepository.save(product);
    return product;
  }

  public async update(data: UpdateProductData): Promise<ProductModel> {
    const product = await this.ormRepository.findOne({
      where: { id: data.id },
    });
    if (product == null) return Promise.reject("Product not found");

    product.name = data.name;
    product.stock = data.stock;
    product.isAlwaysInStock = data.isAlwaysInStock;
    product.price = data.price;
    product.imgUri = data.imgUri;
    if (data.categories) {
      product.categories = data.categories;
    }

    return this.ormRepository.save(product);
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    const products = await this.ormRepository.find();
    await this.ormRepository.remove(products);
  }
}
