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
    const { categoryIds, ...rest } = data;

    let categoryEntities: CategoryModel[] = [];
    if (categoryIds) {
      categoryEntities = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
    }

    const product = this.ormRepository.create({
      ...(categoryIds ? { categoryIds: categoryEntities } : {}),
      ...rest,
    });

    return await this.ormRepository.save(product);
  }

  public async update(data: UpdateProductData): Promise<ProductModel> {
    const { id, categoryIds, ...rest } = data;

    let categoryEntities: CategoryModel[] = [];
    if (categoryIds) {
      categoryEntities = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
    }

    const product = await this.ormRepository.save({
      id,
      ...(categoryIds ? { categories: categoryEntities } : {}),
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
