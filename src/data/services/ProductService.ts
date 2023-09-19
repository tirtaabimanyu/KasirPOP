import { DataSource, In, Repository } from "typeorm";
import { ProductModel } from "../entities/ProductModel";
import { CreateProductData, UpdateProductData } from "../../types/data";
import { CategoryModel } from "../entities/CategoryModel";

export class ProductService {
  private ormRepository: Repository<ProductModel>;
  private categoryRepository: Repository<CategoryModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(ProductModel);
    this.categoryRepository = connection.getRepository(CategoryModel);
  }

  public async getAll(): Promise<ProductModel[]> {
    const products = await this.ormRepository.find({
      relations: {
        categories: true,
      },
    });

    return products;
  }

  public async create(data: CreateProductData): Promise<ProductModel> {
    const { categories, ...rest } = data;

    let categoryEntities: CategoryModel[] = [];
    if (categories) {
      categoryEntities = await this.categoryRepository.find({
        where: { id: In(categories.map((category) => category.id)) },
      });
    }

    const product = this.ormRepository.create({
      ...rest,
      ...(categories ? { category: categoryEntities } : {}),
    });

    return await this.ormRepository.save(product);
  }

  public async update(data: UpdateProductData): Promise<ProductModel> {
    const { id, categories, ...rest } = data;

    let categoryEntities: CategoryModel[] = [];
    if (categories) {
      categoryEntities = await this.categoryRepository.find({
        where: { id: In(categories.map((category) => category.id)) },
      });
    }

    const product = await this.ormRepository.save({
      id: data.id,
      ...(categories ? { category: categoryEntities } : {}),
      ...rest,
    });

    return product;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    const products = await this.ormRepository.find();
    await this.ormRepository.remove(products);
  }
}
